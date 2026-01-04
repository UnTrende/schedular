import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseServer } from '@/lib/supabase/server'

// DELETE /api/posts/cleanup
// Deletes all finished posts (published or failed) for the current user
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = getSupabaseServer()

    // Delete posts where status is 'published' or 'failed'
    // We intentionally keep 'pending' posts
    const { error } = await supabase
      .from('scheduled_posts')
      .delete()
      .eq('user_id', userId)
      .in('status', ['published', 'failed'])

    if (error) {
      console.error('Error cleaning up posts:', error)
      return NextResponse.json(
        { error: 'Failed to cleanup posts' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
