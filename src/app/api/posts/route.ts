import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getUserPosts, createPost, getPostStats } from '@/lib/db/posts'
import { Platform } from '@/types'

// GET /api/posts - Get all posts for current user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse query parameters for filtering
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') as any
    const platform = searchParams.get('platform') as Platform | null
    const limit = searchParams.get('limit')
    const statsOnly = searchParams.get('stats') === 'true'

    // If requesting stats only
    if (statsOnly) {
      const stats = await getPostStats(userId)
      return NextResponse.json({ success: true, data: stats })
    }

    const filters: any = {}
    if (status) filters.status = status
    if (platform) filters.platform = platform
    if (limit) filters.limit = parseInt(limit)

    const { data, error } = await getUserPosts(userId, filters)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/posts - Create a new scheduled post
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content, media_urls, scheduled_at, platform } = body

    // Validate required fields
    if (!content || !scheduled_at || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate platform
    const validPlatforms: Platform[] = ['twitter', 'facebook', 'instagram', 'linkedin']
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      )
    }

    // Validate scheduled_at is in the future
    const scheduledDate = new Date(scheduled_at)
    const now = new Date()
    if (scheduledDate <= now) {
      return NextResponse.json(
        { error: 'Scheduled time must be in the future' },
        { status: 400 }
      )
    }

    const { data, error } = await createPost({
      user_id: userId,
      content,
      media_urls: media_urls || [],
      scheduled_at,
      platform,
    })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      )
    }

    // Schedule with Trigger.dev v3
    try {
      const { tasks } = await import('@trigger.dev/sdk/v3')
      const { publishPostTask } = await import('@/trigger/publish-post')
      
      const now = new Date()
      const scheduledDate = new Date(scheduled_at)
      const delay = scheduledDate.getTime() - now.getTime()

      if (delay > 0) {
        await tasks.trigger("publish-post", { postId: data.id }, { delay: new Date(scheduled_at) });
        console.log('Scheduled post with Trigger.dev:', data.id);
      } else {
        // Immediate trigger
        await tasks.trigger("publish-post", { postId: data.id });
      }

    } catch (scheduleError) {
      console.log('Trigger.dev scheduling failed (check TRIGGER_SECRET_KEY):', scheduleError)
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
