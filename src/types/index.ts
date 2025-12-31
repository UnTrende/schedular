// Database Types
export type Platform = 'twitter' | 'facebook' | 'instagram' | 'linkedin'
export type PostStatus = 'pending' | 'published' | 'failed'
export type ConnectionStatus = 'active' | 'reconnect_needed' | 'inactive'

export interface SocialConnection {
  id: string
  user_id: string
  platform: Platform
  encrypted_access_token: string
  platform_username?: string
  platform_user_id?: string
  status: ConnectionStatus
  last_synced_at?: string
  created_at: string
  updated_at?: string
}

export interface ScheduledPost {
  id: string
  user_id: string
  content: string
  media_urls: string[]
  scheduled_at: string
  platform: Platform
  status: PostStatus
  published_at?: string
  error_message?: string
  created_at: string
  updated_at?: string
}

// Form Types
export interface PostFormData {
  content: string
  mediaUrls: string[]
  scheduledAt: Date
  platform: Platform
}

export interface ConnectionFormData {
  platform: Platform
  accessToken: string
  username?: string
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// UI Types
export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}
