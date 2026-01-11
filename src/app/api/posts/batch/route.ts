import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { deletePostsBatch } from '@/lib/db/posts'

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { postIds } = body

    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return NextResponse.json({ error: 'Invalid post IDs' }, { status: 400 })
    }

    const { success, error } = await deletePostsBatch(userId, postIds)

    if (!success) {
      console.error('Batch delete error:', error)
      return NextResponse.json({ error: 'Failed to delete posts' }, { status: 500 })
    }

    return NextResponse.json({ success: true, count: postIds.length })
  } catch (error) {
    console.error('Batch delete server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
