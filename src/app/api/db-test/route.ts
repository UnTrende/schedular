import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase/client'

// Test endpoint to verify database connection
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Test connections table
    const { data: connections, error: connError } = await supabase()
      .from('social_connections')
      .select('*')
      .eq('user_id', userId)

    // Test posts table
    const { data: posts, error: postsError } = await supabase()
      .from('scheduled_posts')
      .select('*')
      .eq('user_id', userId)

    if (connError || postsError) {
      return NextResponse.json({
        success: false,
        error: connError || postsError,
        message: 'Database query failed - check your Supabase setup'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      data: {
        userId,
        connections: connections || [],
        posts: posts || [],
        tablesAccessible: true
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Failed to connect to database'
    }, { status: 500 })
  }
}
