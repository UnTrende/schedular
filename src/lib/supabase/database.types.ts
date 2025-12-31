// TypeScript types generated from Supabase schema
// This file will be auto-generated once we run the schema migration

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Platform = 'twitter' | 'facebook' | 'instagram' | 'linkedin'
export type PostStatus = 'pending' | 'published' | 'failed'
export type ConnectionStatus = 'active' | 'reconnect_needed' | 'inactive'

export interface Database {
  public: {
    Tables: {
      social_connections: {
        Row: {
          id: string
          user_id: string
          platform: Platform
          encrypted_access_token: string
          platform_username: string | null
          platform_user_id: string | null
          status: ConnectionStatus
          last_synced_at: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          platform: Platform
          encrypted_access_token: string
          platform_username?: string | null
          platform_user_id?: string | null
          status?: ConnectionStatus
          last_synced_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          platform?: Platform
          encrypted_access_token?: string
          platform_username?: string | null
          platform_user_id?: string | null
          status?: ConnectionStatus
          last_synced_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      scheduled_posts: {
        Row: {
          id: string
          user_id: string
          content: string
          media_urls: string[]
          scheduled_at: string
          platform: Platform
          status: PostStatus
          published_at: string | null
          error_message: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          media_urls?: string[]
          scheduled_at: string
          platform: Platform
          status?: PostStatus
          published_at?: string | null
          error_message?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          media_urls?: string[]
          scheduled_at?: string
          platform?: Platform
          status?: PostStatus
          published_at?: string | null
          error_message?: string | null
          created_at?: string
          updated_at?: string | null
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
      platform: Platform
      post_status: PostStatus
      connection_status: ConnectionStatus
    }
  }
}
