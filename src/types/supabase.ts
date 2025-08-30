export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
          company: string | null
          role: string | null
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          company?: string | null
          role?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          company?: string | null
          role?: string | null
        }
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string | null
          session_count: number
          created_at: string
          is_authenticated: boolean
          ip_address: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_count?: number
          created_at?: string
          is_authenticated?: boolean
          ip_address?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          session_count?: number
          created_at?: string
          is_authenticated?: boolean
          ip_address?: string | null
        }
      }
      prompts: {
        Row: {
          id: string
          user_id: string | null
          original_prompt: string
          improved_prompt: string | null
          category: 'custom_instructions' | 'projects_gems' | 'threads'
          created_at: string
          session_id: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          original_prompt: string
          improved_prompt?: string | null
          category: 'custom_instructions' | 'projects_gems' | 'threads'
          created_at?: string
          session_id: string
        }
        Update: {
          id?: string
          user_id?: string | null
          original_prompt?: string
          improved_prompt?: string | null
          category?: 'custom_instructions' | 'projects_gems' | 'threads'
          created_at?: string
          session_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      prompt_category: 'custom_instructions' | 'projects_gems' | 'threads'
    }
  }
}