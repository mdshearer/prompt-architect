import { NextRequest, NextResponse } from 'next/server'
import { together } from '@/lib/together'
import { getClientIP, checkRateLimit, incrementRateLimit } from '@/lib/rate-limiter'
import { validateMessage, validateHistory } from '@/lib/input-validation'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface ChatRequest {
  message: string
  category: 'custom_instructions' | 'projects_gems' | 'threads'
  history: Message[]
}

const SYSTEM_PROMPTS = {
  custom_instructions: `You are an expert AI prompt engineer specializing in custom instructions optimization. Your goal is to help users create powerful, clear, and effective custom instructions for AI systems.

Key principles:
- Be specific and actionable in your guidance
- Focus on clarity, structure, and desired outcomes
- Help users think about context, constraints, and examples
- Suggest improvements for better AI responses
- Keep responses concise but thorough

Always ask clarifying questions to understand their use case better and provide specific, actionable improvements.`,

  projects_gems: `You are an expert in creating AI projects and gems (reusable prompt templates). You help users develop comprehensive project structures and reusable components.

Key areas to focus on:
- Project scope and objectives
- Reusable templates and structures
- Best practices for modularity
- Clear documentation and examples
- Scalability and maintenance

Guide users through creating well-structured, reusable AI tools that can be shared and adapted by others.`,

  threads: `You are a conversation design expert specializing in thread and dialogue optimization. You help users create better structured conversations and improve dialogue flow.

Focus on:
- Conversation flow and pacing
- Clear communication patterns
- Context management across messages
- Effective questioning techniques
- Maintaining engagement and clarity

Help users structure their conversations for maximum clarity and effectiveness.`
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit before processing request
    const clientIP = getClientIP(request)
    const rateLimit = checkRateLimit(clientIP)

    if (!rateLimit.allowed) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit exceeded',
        message: `You've used your ${rateLimit.limit} free messages. Please sign up to continue.`,
        rateLimitInfo: {
          currentCount: rateLimit.currentCount,
          limit: rateLimit.limit,
          resetsAt: rateLimit.resetsAt
        }
      }, { status: 429 })
    }

    const { message, category, history }: ChatRequest = await request.json()

    // Validate input before processing
    const messageValidation = validateMessage(message)
    if (!messageValidation.isValid) {
      return NextResponse.json({
        success: false,
        error: messageValidation.error,
        errorCode: messageValidation.errorCode
      }, { status: 400 })
    }

    // Validate conversation history
    const historyValidation = validateHistory(history)
    if (!historyValidation.isValid) {
      return NextResponse.json({
        success: false,
        error: historyValidation.error
      }, { status: 400 })
    }

    // Use sanitized message for API call
    const sanitizedMessage = messageValidation.sanitizedMessage!

    // Build conversation context
    const conversationHistory = history.slice(-6) // Keep last 6 messages for context
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPTS[category] },
      ...conversationHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user' as const, content: sanitizedMessage }
    ]

    const completion = await together.chat.completions.create({
      model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
      messages,
      max_tokens: 500,
      temperature: 0.7,
      top_p: 0.9,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('No response from AI')
    }

    // Increment rate limit counter after successful request
    incrementRateLimit(clientIP)

    return NextResponse.json({
      success: true,
      response: response.trim()
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}