import { supabase } from '@/lib/supabase/client'
import { getSupabaseServer } from '@/lib/supabase/server'
import { Platform, PostStatus } from '@/types'

// Client-side post operations
export async function getUserPosts(userId: string, filters?: {
  status?: PostStatus
  platform?: Platform
  limit?: number
}) {
  let query = supabase()
    .from('scheduled_posts')
    .select('*')
    .eq('user_id', userId)

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.platform) {
    query = query.eq('platform', filters.platform)
  }

  query = query.order('scheduled_at', { ascending: true })

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching posts:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function getPostById(postId: string) {
  const { data, error } = await supabase()
    .from('scheduled_posts')
    .select('*')
    .eq('id', postId)
    .single()

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

export async function createPost(data: {
  user_id: string
  content: string
  media_urls?: string[]
  scheduled_at: string
  platform: Platform
}) {
  const { data: post, error } = await supabase()
    .from('scheduled_posts')
    .insert([{
      ...data,
      media_urls: data.media_urls || [],
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating post:', error)
    return { data: null, error }
  }

  return { data: post, error: null }
}

export async function updatePost(
  postId: string,
  updates: {
    content?: string
    media_urls?: string[]
    scheduled_at?: string
    platform?: Platform
    status?: PostStatus
    published_at?: string
    error_message?: string
  }
) {
  const { data, error } = await supabase()
    .from('scheduled_posts')
    .update(updates)
    .eq('id', postId)
    .select()
    .single()

  if (error) {
    console.error('Error updating post:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function deletePost(postId: string) {
  const { error } = await supabase()
    .from('scheduled_posts')
    .delete()
    .eq('id', postId)

  if (error) {
    console.error('Error deleting post:', error)
    return { success: false, error }
  }

  return { success: true, error: null }
}

export async function getUpcomingPosts(userId: string, limit = 10) {
  const now = new Date().toISOString()
  
  const { data, error } = await supabase()
    .from('scheduled_posts')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .gte('scheduled_at', now)
    .order('scheduled_at', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('Error fetching upcoming posts:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function getPostStats(userId: string) {
  const { data: allPosts, error } = await supabase()
    .from('scheduled_posts')
    .select('status')
    .eq('user_id', userId)

  if (error) {
    return {
      total: 0,
      pending: 0,
      published: 0,
      failed: 0,
    }
  }

  const stats = {
    total: allPosts.length,
    pending: allPosts.filter(p => p.status === 'pending').length,
    published: allPosts.filter(p => p.status === 'published').length,
    failed: allPosts.filter(p => p.status === 'failed').length,
  }

  return stats
}

// Server-side operations (for API routes and scheduled jobs)
export async function getPostsToPublishServer() {
  const supabase = getSupabaseServer()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('scheduled_posts')
    .select('*')
    .eq('status', 'pending')
    .lte('scheduled_at', now)
    .order('scheduled_at', { ascending: true })

  return { data, error }
}

export async function updatePostStatusServer(
  postId: string,
  status: PostStatus,
  errorMessage?: string
) {
  const supabase = getSupabaseServer()
  
  const updates: any = { status }
  
  if (status === 'published') {
    updates.published_at = new Date().toISOString()
  }
  
  if (errorMessage) {
    updates.error_message = errorMessage
  }

  const { data, error } = await supabase
    .from('scheduled_posts')
    .update(updates)
    .eq('id', postId)
    .select()
    .single()

  return { data, error }
}
