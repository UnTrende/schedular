import { getSupabaseServerClient } from '@/lib/supabase/server'
import { Platform, ConnectionStatus } from '@/types'

// Helper to get the correct client
const getDb = () => getSupabaseServerClient()

// Client-side connection operations
export async function getUserConnections(userId: string) {
  const { data, error } = await getDb()
    .from('social_connections')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching connections:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function getConnectionByPlatform(userId: string, platform: Platform) {
  const { data, error } = await getDb()
    .from('social_connections')
    .select('*')
    .eq('user_id', userId)
    .eq('platform', platform)
    .single()

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

export async function createConnection(data: {
  user_id: string
  platform: Platform
  encrypted_access_token: string
  platform_username?: string
  platform_user_id?: string
}) {
  const { data: connection, error } = await getDb()
    .from('social_connections')
    .insert([data])
    .select()
    .single()

  if (error) {
    console.error('Error creating connection:', error)
    return { data: null, error }
  }

  return { data: connection, error: null }
}

export async function updateConnection(
  connectionId: string,
  updates: {
    encrypted_access_token?: string
    platform_username?: string
    platform_user_id?: string
    status?: ConnectionStatus
    last_synced_at?: string
  }
) {
  const { data, error } = await getDb()
    .from('social_connections')
    .update(updates)
    .eq('id', connectionId)
    .select()
    .single()

  if (error) {
    console.error('Error updating connection:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function deleteConnection(connectionId: string) {
  const { error } = await getDb()
    .from('social_connections')
    .delete()
    .eq('id', connectionId)

  if (error) {
    console.error('Error deleting connection:', error)
    return { success: false, error }
  }

  return { success: true, error: null }
}

// Server-side operations (for API routes)
export async function getConnectionByPlatformServer(userId: string, platform: Platform) {
  const supabase = getDb()
  
  const { data, error } = await supabase
    .from('social_connections')
    .select('*')
    .eq('user_id', userId)
    .eq('platform', platform)
    .single()

  return { data, error }
}
