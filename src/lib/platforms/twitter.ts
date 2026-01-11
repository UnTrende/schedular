import { SocialPlatform, PublishResult } from "./types";
import { ScheduledPost } from "@/types";

export class TwitterPlatform implements SocialPlatform {
    async publish(
        post: ScheduledPost,
        accessToken: string,
        _platformUserId: string
    ): Promise<PublishResult> {
        try {
            console.log("Publishing to Twitter/X...");

            // Twitter v2 API endpoint for tweets
            const twitterUrl = "https://api.twitter.com/2/tweets";

            // Basic payload for text-only
            const payload: any = {
                text: post.content,
            };

            // Handle media if present (Requires separate media upload step in production)
            // For now, we'll assume media IDs are handled or just log the intent
            if (post.media_urls && post.media_urls.length > 0) {
                console.log("Media detected for Twitter. In production, this requires media/upload endpoint first.");
                // payload.media = { media_ids: [...] };
            }

            const response = await fetch(twitterUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Twitter API error: ${JSON.stringify(errorData)}`);
            }

            const result = await response.json();
            return {
                success: true,
                platform: "twitter",
                postId: result.data.id,
            };

        } catch (error: any) {
            console.error("Twitter publish error:", error);
            throw error;
        }
    }
}
