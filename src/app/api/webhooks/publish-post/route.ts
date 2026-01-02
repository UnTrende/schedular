import { NextRequest, NextResponse } from 'next/server'
import { verifyQStashSignature } from '@/lib/qstash-client'
import { getPostById, updatePost } from '@/lib/db/posts'

// POST /api/webhooks/publish-post
// Webhook called by QStash when it's time to publish a post
export async function POST(request: NextRequest) {
  try {
    // Verify signature from either Trigger.dev (shared secret) or QStash
    const triggerSecret = request.headers.get('x-trigger-secret')
    const expectedTriggerSecret = process.env.TRIGGER_WEBHOOK_SECRET

    const signature = request.headers.get('upstash-signature') || ''
    const body = await request.text()

    const triggerAuthorized = !!expectedTriggerSecret && triggerSecret === expectedTriggerSecret
    const qstashAuthorized = verifyQStashSignature(signature, body)

    if (!triggerAuthorized && !qstashAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized: invalid signature' },
        { status: 401 }
      )
    }

    // Parse webhook payload
    const payload = JSON.parse(body)
    const { postId } = payload

    if (!postId) {
      return NextResponse.json(
        { error: 'Missing postId' },
        { status: 400 }
      )
    }

    // Get the post
    const { data: post, error: fetchError } = await getPostById(postId)

    if (fetchError || !post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if post is still pending
    if (post.status !== 'pending') {
      return NextResponse.json(
        { error: 'Post is not pending' },
        { status: 400 }
      )
    }

    // Get connection for this platform
    const { getConnectionByPlatformServer } = await import('@/lib/db/connections')
    const { data: connection } = await getConnectionByPlatformServer(
      post.user_id,
      post.platform
    )

    if (!connection) {
      await updatePost(postId, {
        status: 'failed',
        error_message: 'No connection found for this platform',
      })
      
      return NextResponse.json({
        success: false,
        error: 'No connection found',
      }, { status: 400 })
    }

    // Call worker service to publish
    console.log(`Publishing post ${postId} to ${post.platform}...`)
    
    const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:8080'
    
    try {
      const publishResponse = await fetch(`${workerUrl}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: post.platform,
          content: post.content,
          mediaUrls: post.media_urls || [],
          accessToken: connection.encrypted_access_token,
          username: connection.platform_username,
        }),
      })

      const publishResult = await publishResponse.json()
      const publishSuccess = publishResult.success
    
    if (publishSuccess) {
      // Mark as published
      await updatePost(postId, {
        status: 'published',
        published_at: new Date().toISOString(),
      })

      return NextResponse.json({
        success: true,
        message: 'Post published successfully',
        postId,
      })
    } else {
      // Mark as failed
      await updatePost(postId, {
        status: 'failed',
        error_message: 'Failed to publish to platform',
      })

      return NextResponse.json({
        success: false,
        error: 'Failed to publish post',
      }, { status: 500 })
    }
  } catch (publishError: any) {
    console.error('Worker publish error:', publishError)
    
    // Mark as failed
    await updatePost(postId, {
      status: 'failed',
      error_message: publishError.message || 'Failed to connect to worker',
    })

    return NextResponse.json({
      success: false,
      error: 'Failed to publish',
    }, { status: 500 })
  }
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: 'Publish webhook endpoint',
    status: 'ready',
  })
}
