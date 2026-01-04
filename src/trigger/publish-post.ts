import { task } from "@trigger.dev/sdk/v3";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { OAUTH_PROVIDERS } from "@/lib/oauth-providers";
import { Platform } from "@/types";
import { decryptToken } from "@/lib/encryption";

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

    // 5. Publish to Social Media
    
    try {
        console.log(`Publishing to ${post.platform}...`);
        
        // Debug: Check if encryption key exists in env
        const envKey = process.env.ENCRYPTION_KEY;
        console.log(`Encryption Key Check: ${envKey ? `Exists (starts with ${envKey.substring(0, 4)}...)` : 'MISSING'}`);
        
        // Debug: Check the encrypted token from DB
        console.log(`Encrypted Token Check: ${connection.encrypted_access_token ? `Exists (length: ${connection.encrypted_access_token.length})` : 'MISSING/EMPTY'}`);

        // Decrypt the access token
        const accessToken = decryptToken(connection.encrypted_access_token);
        
        if (!accessToken) {
          throw new Error("Failed to decrypt access token or token is missing");
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
          // Instagram Graph API - 2-step process
          const instagramAccountId = connection.platform_user_id; // Instagram Business Account ID
          
          if (!instagramAccountId) {
            throw new Error("Missing Instagram Business Account ID");
          }

          if (!post.media_urls || post.media_urls.length === 0) {
            throw new Error("Instagram requires at least one image or video");
          }

          // Step 1: Create media container (forced update)
          const mediaUrl = post.media_urls[0];
          const containerUrl = `https://graph.facebook.com/v21.0/${instagramAccountId}/media`;
          const containerPayload = {
            image_url: mediaUrl,
            caption: post.content,
            access_token: accessToken,
          };

          const containerResponse = await fetch(containerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(containerPayload),
          });

          if (!containerResponse.ok) {
            const errorData = await containerResponse.json();
            throw new Error(`Instagram container creation error: ${JSON.stringify(errorData)}`);
          }

          const containerResult = await containerResponse.json();
          const containerId = containerResult.id;

          console.log("Instagram container created:", containerId);

          // Step 2: Publish the container
          const publishUrl = `https://graph.facebook.com/v21.0/${instagramAccountId}/media_publish`;
          const publishPayload = {
            creation_id: containerId,
            access_token: accessToken,
          };

          const publishResponse = await fetch(publishUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(publishPayload),
          });

          if (!publishResponse.ok) {
            const errorData = await publishResponse.json();
            throw new Error(`Instagram publish error: ${JSON.stringify(errorData)}`);
          }

          const publishResult = await publishResponse.json();
          console.log("Instagram post published:", publishResult.id);
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
