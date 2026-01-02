import { task } from "@trigger.dev/sdk/v3";
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
        
        // Real platform publishing logic
        const accessToken = connection.encrypted_access_token; // Should be decrypted in production
        
        if (!accessToken) {
          throw new Error("Missing access token for platform");
        }

        if (post.platform === 'facebook') {
          // Facebook Graph API - Post to Page
          const pageId = connection.platform_user_id; // The Facebook Page ID
          
          if (!pageId) {
            throw new Error("Missing Facebook Page ID");
          }

          const fbUrl = `https://graph.facebook.com/v21.0/${pageId}/feed`;
          const fbPayload: any = {
            message: post.content,
            access_token: accessToken,
          };

          // Add media if present
          if (post.media_urls && post.media_urls.length > 0) {
            // For single image
            if (post.media_urls.length === 1) {
              fbPayload.link = post.media_urls[0];
            } else {
              // For multiple images, use a different endpoint
              console.log("Multiple media not implemented yet, posting text only");
            }
          }

          const fbResponse = await fetch(fbUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fbPayload),
          });

          if (!fbResponse.ok) {
            const errorData = await fbResponse.json();
            throw new Error(`Facebook API error: ${JSON.stringify(errorData)}`);
          }

          const fbResult = await fbResponse.json();
          console.log("Facebook post created:", fbResult.id);
        } else if (post.platform === 'instagram') {
          // Instagram publishing requires different flow (container creation + publish)
          throw new Error("Instagram publishing not yet implemented");
        } else if (post.platform === 'twitter') {
          // Twitter API v2
          throw new Error("Twitter publishing not yet implemented");
        } else if (post.platform === 'linkedin') {
          // LinkedIn API
          throw new Error("LinkedIn publishing not yet implemented");
        } else {
          throw new Error(`Unsupported platform: ${post.platform}`);
        }

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
