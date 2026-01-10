import { SocialPlatform, PublishResult } from "./types";
import { ScheduledPost } from "@/types";

export class FacebookPlatform implements SocialPlatform {
    private readonly P_API_VERSION = "v21.0"; // Consider moving to constants

    async publish(
        post: ScheduledPost,
        accessToken: string,
        pageId: string
    ): Promise<PublishResult> {
        try {
            console.log(`Publishing to Facebook Page: ${pageId}`);

            const fbUrl = `https://graph.facebook.com/${this.P_API_VERSION}/${pageId}/feed`;
            const fbPayload: any = {
                message: post.content,
                access_token: accessToken,
            };

            // Handle Media
            if (post.media_urls && post.media_urls.length > 0) {
                if (post.media_urls.length === 1) {
                    // Link posts (auto-preview if it's a URL, or photo post if upload - assuming link for now as per legacy code)
                    fbPayload.link = post.media_urls[0];
                } else {
                    // TODO: Implement multi-image carousel or album support
                    console.warn("Multiple media not fully supported for Facebook yet, defaulting to text/link only.");
                }
            }

            const response = await fetch(fbUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fbPayload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Facebook API error: ${JSON.stringify(errorData)}`);
            }

            const result = await response.json();
            return {
                success: true,
                platform: "facebook",
                postId: result.id,
            };

        } catch (error: any) {
            console.error("Facebook publish error:", error);
            throw error; // Propagate to worker for error handling
        }
    }
}
