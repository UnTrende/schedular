import { job } from "@trigger.dev/sdk"
import { getPostById, updatePost } from "@/lib/db/posts"

export const publishScheduledPost = job({
  id: "publish-scheduled-post",
  name: "Publish Scheduled Social Post",
  version: "1.0.0",
  trigger: {
    type: "event",
    name: "publish_post",
  },
  run: async (payload: { postId: string }) => {
    const postId = payload.postId
    if (!postId) throw new Error("Missing postId in payload")

    const { data: post, error } = await getPostById(postId)
    if (error || !post) throw new Error("Post not found")

    if (post.status !== "pending") {
      return { skipped: true, reason: `Post status is ${post.status}` }
    }

    const { getConnectionByPlatformServer } = await import("@/lib/db/connections")
    const { data: connection } = await getConnectionByPlatformServer(post.user_id, post.platform)
    if (!connection) {
      await updatePost(postId, { status: "failed", error_message: "No connection for platform" })
      return { success: false, error: "No connection" }
    }

    const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || "http://localhost:8080"

    try {
      const publishResponse = await fetch(`${workerUrl}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: post.platform,
          content: post.content,
          mediaUrls: post.media_urls || [],
          accessToken: connection.encrypted_access_token,
          username: connection.platform_username,
        }),
      })

      const publishResult = await publishResponse.json()
      if (publishResult.success) {
        await updatePost(postId, { status: "published", published_at: new Date().toISOString() })
        return { success: true }
      } else {
        await updatePost(postId, { status: "failed", error_message: "Failed to publish to platform" })
        return { success: false }
      }
    } catch (err: any) {
      await updatePost(postId, { status: "failed", error_message: err?.message || "Worker error" })
      throw err
    }
  },
})
