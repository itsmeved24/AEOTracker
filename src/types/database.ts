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
      tenants: {
        Row: {
          id: string
          name: string
          domain: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          domain?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          domain?: string | null
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          tenant_id: string
          name: string
          domain: string
          brand_name: string
          competitors: string[]
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          domain: string
          brand_name: string
          competitors?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          domain?: string
          brand_name?: string
          competitors?: string[]
          created_at?: string
        }
      }
      keywords: {
        Row: {
          id: string
          project_id: string
          keyword: string
          category: string | null
          priority: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          keyword: string
          category?: string | null
          priority?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          keyword?: string
          category?: string | null
          priority?: number
          created_at?: string
        }
      }
      visibility_checks: {
        Row: {
          id: string
          keyword_id: string
          engine: string
          position: number | null
          presence: boolean
          answer_snippet: string | null
          citations_count: number
          observed_urls: string[]
          sentiment: string | null
          timestamp: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          keyword_id: string
          engine: string
          position?: number | null
          presence?: boolean
          answer_snippet?: string | null
          citations_count?: number
          observed_urls?: string[]
          sentiment?: string | null
          timestamp?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          keyword_id?: string
          engine?: string
          position?: number | null
          presence?: boolean
          answer_snippet?: string | null
          citations_count?: number
          observed_urls?: string[]
          sentiment?: string | null
          timestamp?: string
          metadata?: Json | null
        }
      }
    }
  }
}

export const AI_ENGINES = ['chatgpt', 'gemini', 'claude', 'perplexity', 'google_aio'] as const
export type AIEngine = typeof AI_ENGINES[number]

export const SENTIMENTS = ['positive', 'neutral', 'negative'] as const
export type Sentiment = typeof SENTIMENTS[number]
