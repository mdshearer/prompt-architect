import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { together } from '@/lib/together'

export async function GET(request: NextRequest) {
  try {
    // Test Supabase connection
    const { data: supabaseTest, error: supabaseError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (supabaseError && supabaseError.code !== 'PGRST116') { // PGRST116 = table doesn't exist yet
      throw new Error(`Supabase error: ${supabaseError.message}`)
    }

    // Test Together.ai connection
    const togetherTest = await together.chat.completions.create({
      messages: [{ role: 'user', content: 'Say "API test successful"' }],
      model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
      max_tokens: 10,
    })

    return NextResponse.json({
      success: true,
      supabase: {
        connected: true,
        message: supabaseError?.code === 'PGRST116' ? 'Tables not created yet' : 'Connected'
      },
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