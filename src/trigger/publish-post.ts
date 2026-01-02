import { task } from "@trigger.dev/sdk";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { OAUTH_PROVIDERS } from "@/lib/oauth-providers";
import { Platform } from "@/types";

export const publishPostTask = task({
  id: "publish-post",
  // Set a longer timeout for social media API calls
  maxDuration: 60, 
  run: async (payload: { postId: string }, { ctx }) => {
    console.log(`Starting publish task for post ${payload.postId}`);
    
    // 1. Initialize DB Client (Service Role)
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

    // 3. Check Status (Prevent double publishing)
    if (post.status === "published") {
      console.log("Post already published, skipping.");
      return { status: "skipped", reason: "already_published" };
    }

    if (post.status === "failed") {
      console.log("Post marked as failed, retrying...");
    }

    // 4. Fetch Connection (Get Access Token)
    const { data: connection, error: connError } = await supabase
      .from("social_connections")
      .select("*")
      .eq("user_id", post.user_id)
      .eq("platform", post.platform)
      .single();

    if (connError || !connection) {
      const errorMsg = "No active connection found for this platform.";
      await supabase
        .from("scheduled_posts")
        .update({ status: "failed", error_message: errorMsg })
        .eq("id", payload.postId);
      throw new Error(errorMsg);
    }

    // 5. Publish to Social Media (Mock logic for now, real logic requires decryption)
    // In a real app, you would decrypt `connection.encrypted_access_token` here
    // and use the specific API for Facebook/Instagram etc.
    
    try {
        console.log(`Publishing to ${post.platform}...`);
        
        // --- SIMULATED PUBLISHING LOGIC ---
        // (Replace this block with actual API calls to FB/Insta/Twitter)
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        
        // Example check for specific platforms (placeholders)
        if (post.platform === 'facebook' && !connection.encrypted_access_token) {
             throw new Error("Missing access token");
        }
        // ----------------------------------

        // 6. Update Post to Published
        const { error: updateError } = await supabase
            .from("scheduled_posts")
            .update({ 
                status: "published", 
                published_at: new Date().toISOString(),
                error_message: null
            })
            .eq("id", payload.postId);

        if (updateError) throw updateError;

        return { success: true, platform: post.platform };

    } catch (err: any) {
        console.error("Publishing failed:", err);
        
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
