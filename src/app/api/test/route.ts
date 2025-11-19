import { NextRequest, NextResponse } from 'next/server'
import { together } from '@/lib/together'

export async function GET(request: NextRequest) {
  try {
    // Test Together.ai API connection
    const togetherTest = await together.chat.completions.create({
      messages: [{ role: 'user', content: 'Say "API test successful"' }],
      model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
      max_tokens: 10,
    })

    return NextResponse.json({
      success: true,
      together: {
        connected: true,
        testResponse: togetherTest.choices[0]?.message?.content || 'No response'
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}