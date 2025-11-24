/**
 * Intake Flow API Route
 *
 * Handles the initial intake flow submission where users provide their AI tool selection,
 * prompt type preference, and initial thoughts. Generates customized output based on
 * the selected options.
 *
 * Key differences from regular chat endpoint:
 * - Uses intake-specific validation (20-500 char limit)
 * - Exempt from rate limiting (intake doesn't count toward free messages)
 * - Returns formatted output with optional setup instructions (Section 1 for Prompt Architect)
 * - Uses AI tool + prompt type specific system prompts
 *
 * POST /api/chat/intake
 *
 * @module api/chat/intake
 */

import { NextRequest, NextResponse } from 'next/server'
import { together } from '@/lib/together'
import { getClientIP, checkRateLimit, incrementRateLimit } from '@/lib/rate-limiter'
import { logger } from '@/lib/logger'
import { loadInstructions, buildSystemPrompt } from '@/lib/intake-instructions'
import { formatOutput } from '@/lib/output-formatter'
import { buildUserContext } from '@/lib/intake-helpers'
import {
  AI_MAX_TOKENS_ENHANCED,
  AI_TEMPERATURE_ENHANCED,
  AI_TOP_P_ENHANCED,
  API_TIMEOUT_MS
} from '@/lib/constants'
import type {
  IntakeAPIRequest,
  IntakeAPIResponse,
  AiTool,
  PromptType,
  GuidedQuestions
} from '@/types/intake'

/**
 * Validates that the AI tool is a valid option
 */
function isValidAiTool(tool: string): tool is AiTool {
  return ['chatgpt', 'claude', 'gemini', 'copilot'].includes(tool)
}

/**
 * Validates that the prompt type is a valid option
 */
function isValidPromptType(type: string): type is PromptType {
  return ['prompt-architect', 'custom-instructions', 'projects', 'gems', 'general-prompt'].includes(type)
}

/**
 * POST handler for intake flow submissions
 *
 * @param request - Next.js request object
 * @returns JSON response with formatted output or error
 */
export async function POST(request: NextRequest): Promise<NextResponse<IntakeAPIResponse>> {
  // Create AbortController for timeout handling
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

  try {
    // Get client IP for rate limiting (even though intake is exempt, we log it)
    const clientIP = getClientIP(request)

    // Check rate limit with isIntake=true (will always pass, but maintains consistency)
    const rateLimit = await checkRateLimit(clientIP, undefined, true)
    logger.info('Intake request received', { clientIP, allowed: rateLimit.allowed })

    // Parse request body
    let body: IntakeAPIRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Invalid request body - expected JSON'
      }, { status: 400 })
    }

    const { aiTool, promptType, guidedQuestions } = body

    // Validate required fields are present
    if (!aiTool || !promptType || !guidedQuestions) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: aiTool, promptType, and guidedQuestions are required'
      }, { status: 400 })
    }

    // Validate AI tool
    if (!isValidAiTool(aiTool)) {
      return NextResponse.json({
        success: false,
        error: `Invalid AI tool: ${aiTool}. Valid options are: chatgpt, claude, gemini, copilot`
      }, { status: 400 })
    }

    // Validate prompt type
    if (!isValidPromptType(promptType)) {
      return NextResponse.json({
        success: false,
        error: `Invalid prompt type: ${promptType}`
      }, { status: 400 })
    }

    // Validate required guided questions are present
    const requiredFields: (keyof GuidedQuestions)[] = ['role', 'goal', 'tasks', 'tone', 'outputDetail']
    const missingFields = requiredFields.filter(field => !guidedQuestions[field])

    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required questions: ${missingFields.join(', ')}`
      }, { status: 400 })
    }

    // Build user context from guided questions
    const userContext = buildUserContext(guidedQuestions)

    // Load AI tool + prompt type specific instructions
    let instructions
    try {
      instructions = await loadInstructions(aiTool, promptType)
    } catch (error) {
      logger.error('Failed to load instructions', { aiTool, promptType, error })
      return NextResponse.json({
        success: false,
        error: `No instructions available for ${aiTool} + ${promptType} combination`
      }, { status: 500 })
    }

    // Build the system prompt
    const systemPrompt = buildSystemPrompt(instructions, userContext, aiTool, promptType)

    // Call Together.ai API
    let completion
    try {
      completion = await together.chat.completions.create({
        model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please generate my ${promptType === 'prompt-architect' ? 'Prompt Architect custom instruction set' : 'customized prompt'} based on the context I provided.` }
        ],
        max_tokens: AI_MAX_TOKENS_ENHANCED,
        temperature: AI_TEMPERATURE_ENHANCED,
        top_p: AI_TOP_P_ENHANCED,
      })
    } catch (error) {
      // Check if it was an abort (timeout)
      if (controller.signal.aborted) {
        logger.error('Intake API timeout', { aiTool, promptType })
        return NextResponse.json({
          success: false,
          error: 'Request timed out. Please try again.'
        }, { status: 408 })
      }

      logger.error('Together.ai API error', error)
      return NextResponse.json({
        success: false,
        error: 'AI service temporarily unavailable. Please try again.'
      }, { status: 500 })
    }

    // Extract AI response
    const aiResponse = completion.choices[0]?.message?.content
    if (!aiResponse) {
      logger.error('Empty response from Together.ai')
      return NextResponse.json({
        success: false,
        error: 'Received empty response from AI. Please try again.'
      }, { status: 500 })
    }

    // Format the output (includes Section 1 for Prompt Architect)
    let formattedOutput
    try {
      formattedOutput = await formatOutput(aiResponse, promptType, aiTool, userContext)
    } catch (error) {
      logger.warn('Output formatting error, returning raw response', error)
      formattedOutput = {
        section2: aiResponse.trim(),
        promptType
      }
    }

    // Increment rate limit with isIntake=true (won't actually increment)
    incrementRateLimit(clientIP, true)

    logger.info('Intake request completed successfully', { aiTool, promptType })

    return NextResponse.json({
      success: true,
      output: formattedOutput
    })

  } catch (error) {
    // Clear timeout on any error
    clearTimeout(timeoutId)

    // Log the error without exposing internals to user
    logger.error('Intake API unexpected error', error)

    return NextResponse.json({
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    }, { status: 500 })

  } finally {
    // Always clear the timeout
    clearTimeout(timeoutId)
  }
}
