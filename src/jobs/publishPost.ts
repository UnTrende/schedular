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

    // Direct publish inside Trigger.dev (no external worker)
    // TODO: Replace this mock publish with real platform integrations.
    try {
      // Example: Perform platform-specific API calls here using connection credentials
      // For now, we optimistically mark as published to complete the flow
      await updatePost(postId, { status: "published", published_at: new Date().toISOString() })
      return { success: true, method: "trigger-direct" }
    } catch (err: any) {
      await updatePost(postId, { status: "failed", error_message: err?.message || "Direct publish error" })
      throw err
    }
  },
})
