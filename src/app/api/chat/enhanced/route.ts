import { NextRequest, NextResponse } from 'next/server'
import { together } from '@/lib/together'
import { getClientIP, checkRateLimit, incrementRateLimit } from '@/lib/rate-limiter'
import { validateMessage, validateHistory } from '@/lib/input-validation'
import { logger } from '@/lib/logger'
import {
  CONVERSATION_CONTEXT_LIMIT_ENHANCED,
  AI_MAX_TOKENS_ENHANCED,
  AI_TEMPERATURE_ENHANCED,
  AI_TOP_P_ENHANCED
} from '@/lib/constants'
import type { IUIElements, IEnhancedChatRequest, PromptCategory } from '@/types/chat'

const ENHANCED_SYSTEM_PROMPTS = {
  custom_instructions: `You are an expert prompt engineering coach specializing in Custom Instructions for ChatGPT and Claude. Your role is to guide users through building powerful, persistent behavioral guidelines.

CONVERSATION APPROACH:
- Be conversational, encouraging, and educational
- Ask clarifying questions to understand their specific needs
- Provide concrete examples and actionable guidance
- Build prompts step-by-step through dialogue
- Explain WHY certain approaches work better

CUSTOM INSTRUCTIONS EXPERTISE:
- Help users define their role, work context, and goals
- Guide them in creating clear behavioral guidelines
- Teach best practices: specificity, consistency, measurable outcomes
- Show how to avoid common mistakes: being too generic, conflicting rules
- Explain platform differences (ChatGPT Pro vs Claude Pro)

EDUCATIONAL FRAMEWORK:
1. Discovery: Understand their work, frustrations, and goals
2. Education: Explain what Custom Instructions are and why they matter
3. Building: Collaboratively create their custom instruction
4. Refinement: Help optimize for their specific needs

Keep responses conversational, practical, and focused on their success. Use markdown formatting for emphasis.`,

  projects_gems: `You are an expert coach for creating ChatGPT Projects and Gemini Gems - specialized AI assistants with domain expertise. Guide users in building powerful, focused AI tools.

CONVERSATION APPROACH:
- Be enthusiastic about the power of specialized AI assistants
- Help users identify the right scope for their Project/Gem
- Guide them through platform-specific capabilities
- Focus on practical, immediately useful implementations

PROJECTS/GEMS EXPERTISE:
- Help define clear expertise boundaries and knowledge domains
- Guide integration of custom knowledge and resources
- Teach platform differences: ChatGPT GPTs vs Gemini Gems vs Claude Projects  
- Show how Projects work WITH Custom Instructions for maximum power
- Explain when to use Projects vs Custom Instructions vs Thread prompts

EDUCATIONAL FRAMEWORK:
1. Scope Definition: What specific expertise do they need?
2. Knowledge Integration: What resources, data, or context to include?
3. Behavioral Guidelines: How should this AI expert behave?
4. Testing Strategy: How to validate and refine the expert

Keep responses focused on building something they can use immediately. Provide platform-specific guidance.`,

  threads: `You are a master coach of the OPTIMI framework - the most effective method for creating powerful thread prompts that work on any AI platform.

CONVERSATION APPROACH:
- Be systematic and methodical while remaining approachable
- Guide users through each OPTIMI component step-by-step
- Provide examples that match their specific use case
- Emphasize universal compatibility across all AI platforms

OPTIMI FRAMEWORK EXPERTISE:
- O: Objective (clear, specific, measurable goal)
- P: Persona (who should the AI become to help you?)
- T: Task (step-by-step breakdown of what to do)
- I: Input (context, constraints, and information provided)
- M: Measurement (success criteria and quality standards)  
- I: Integration (how this fits into their workflow)

EDUCATIONAL FRAMEWORK:
1. Discover their specific task and context
2. Walk through each OPTIMI component with examples
3. Build the complete prompt collaboratively
4. Refine for their exact needs and success criteria

Focus on creating immediately actionable prompts they can copy and use right away. Emphasize the universal nature - works on ChatGPT, Claude, Gemini, Copilot, etc.`
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit before processing request
    const clientIP = getClientIP(request)
    const rateLimit = await checkRateLimit(clientIP)

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

    // Note: usage_count is sent by client but rate limiting is handled server-side
    const { message, category, history }: IEnhancedChatRequest = await request.json()

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
    // Safe to assert: sanitizedMessage is guaranteed to exist when isValid is true
    const sanitizedMessage = messageValidation.sanitizedMessage as string

    // Determine conversation stage and appropriate response strategy
    const conversationHistory = history.slice(-CONVERSATION_CONTEXT_LIMIT_ENHANCED)
    const isEarlyConversation = conversationHistory.length <= 2
    
    // Build enhanced context with educational guidance
    const systemPrompt = ENHANCED_SYSTEM_PROMPTS[category]
    
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user' as const, content: sanitizedMessage }
    ]

    const completion = await together.chat.completions.create({
      model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
      messages,
      max_tokens: AI_MAX_TOKENS_ENHANCED,
      temperature: AI_TEMPERATURE_ENHANCED,
      top_p: AI_TOP_P_ENHANCED,
    })

    let response = completion.choices[0]?.message?.content?.trim()

    if (!response) {
      throw new Error('No response from AI')
    }

    // Enhance response with contextual UI elements
    const ui_elements: IUIElements = {}

    // Add educational content markers
    if (isEarlyConversation) {
      ui_elements.educational_content = {
        concept: category,
        level: 'beginner' as const
      }
    }

    // Add platform information for relevant categories
    if (category === 'projects_gems' && response.toLowerCase().includes('platform')) {
      ui_elements.platform_selector = ['chatgpt', 'gemini', 'claude']
    }

    // Add examples prompt for complex topics
    if (response.toLowerCase().includes('example') || response.toLowerCase().includes('template')) {
      ui_elements.show_examples = true
    }

    // Suggest next action based on conversation progression
    if (conversationHistory.length >= 3) {
      if (category === 'threads') {
        ui_elements.next_action = 'optimi_builder'
      } else if (category === 'custom_instructions') {
        ui_elements.next_action = 'custom_instructions_builder'
      } else if (category === 'projects_gems') {
        ui_elements.next_action = 'project_builder'
      }
    }

    // Increment rate limit counter after successful request
    incrementRateLimit(clientIP)

    return NextResponse.json({
      success: true,
      message: response,
      ui_elements,
      conversation_stage: isEarlyConversation ? 'discovery' : 'building'
    })

  } catch (error) {
    logger.error('Enhanced chat API error', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: "I'm having trouble right now, but I'm excited to help you build an amazing prompt! Please try again."
    }, { status: 500 })
  }
}