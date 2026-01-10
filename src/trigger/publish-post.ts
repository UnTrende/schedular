import { task } from "@trigger.dev/sdk/v3";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { PlatformFactory } from "@/lib/platforms/factory";
import { decryptToken } from "@/lib/encryption";

export const publishPostTask = task({
  id: "publish-post",
  maxDuration: 300, // Increased for media processing safety
  run: async (payload: { postId: string }, { ctx }) => {
    console.log(`Starting publish task for post ${payload.postId}`);

    // 1. Initialize DB Client
    const supabase = getSupabaseServerClient();

    // 2. Fetch Post
    const { data: post, error: postError } = await supabase
      .from("scheduled_posts")
      .select("*")
      .eq("id", payload.postId)
      .single();

    if (postError || !post) {
      console.error("Post not found:", postError);
      throw new Error(`Post not found: ${postError?.message}`);
    }

    // 3. Idempotency Check
    if (post.status === "published") {
      console.log("Post already published, skipping.");
      return { status: "skipped", reason: "already_published" };
    }

    try {
      // 4. Fetch Connection
      const { data: connection, error: connError } = await supabase
        .from("social_connections")
        .select("*")
        .eq("user_id", post.user_id)
        .eq("platform", post.platform)
        .single();

      if (connError || !connection) {
        throw new Error("No active connection found for this platform.");
      }

      // 5. Decrypt Token
      const accessToken = decryptToken(connection.encrypted_access_token);
      if (!accessToken) {
        throw new Error("Failed to decrypt access token");
      }

      const platformUserId = connection.platform_user_id;
      if (!platformUserId) {
        throw new Error(`Missing platform user ID for ${post.platform}`);
      }

      // 6. Execute Publish via Strategy Pattern
      const platformAdapter = PlatformFactory.getPlatform(post.platform);
      const result = await platformAdapter.publish(post, accessToken, platformUserId);

      console.log(`Published successfully to ${result.platform}. ID: ${result.postId}`);

      // 7. Update DB Success
      const { error: updateError } = await supabase
        .from("scheduled_posts")
        .update({
          status: "published",
          published_at: new Date().toISOString(),
          error_message: null
        })
        .eq("id", payload.postId);

      if (updateError) throw updateError;

      return result;

    } catch (err: any) {
      console.error("Publishing failed:", err);

      // Update DB Failure
      await supabase
        .from("scheduled_posts")
        .update({
          status: "failed",
          error_message: err.message || "Unknown error during publishing"
        })
        .eq("id", payload.postId);

      throw err;
    }
  },
});

