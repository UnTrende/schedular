import { getSupabaseServerClient } from '@/lib/supabase/server'
import { Platform, PostStatus } from '@/types'

// Helper to get the correct client
const getDb = () => getSupabaseServerClient()

// Operations
export async function getUserPosts(userId: string, filters?: {
  status?: PostStatus
  platform?: Platform
  limit?: number
}) {
  let query = getDb()
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
  const { data, error } = await getDb()
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
  const { data: post, error } = await getDb()
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
  const { data, error } = await getDb()
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
  const { error } = await getDb()
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
  
  const { data, error } = await getDb()
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
  const db = getDb()
  
  const queries = [
    db.from('scheduled_posts').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    db.from('scheduled_posts').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'pending'),
    db.from('scheduled_posts').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'published'),
    db.from('scheduled_posts').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'failed')
  ]

  const [totalRes, pendingRes, publishedRes, failedRes] = await Promise.all(queries)

  return {
    total: totalRes.count || 0,
    pending: pendingRes.count || 0,
    published: publishedRes.count || 0,
    failed: failedRes.count || 0,
  }
}

// Server-side operations (for API routes and scheduled jobs)
export async function getPostsToPublishServer() {
  const supabase = getDb()
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
  const supabase = getDb()
  
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
