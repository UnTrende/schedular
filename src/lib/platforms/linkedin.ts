import { SocialPlatform, PublishResult } from "./types";
import { ScheduledPost } from "@/types";

export class LinkedInPlatform implements SocialPlatform {
    async publish(
        post: ScheduledPost,
        accessToken: string,
        platformUserId: string
    ): Promise<PublishResult> {
        try {
            console.log(`Publishing to LinkedIn for user: ${platformUserId}`);

            const linkedInUrl = "https://api.linkedin.com/v2/ugcPosts";

            const payload = {
                author: `urn:li:person:${platformUserId}`,
                lifecycleState: "PUBLISHED",
                specificContent: {
                    "com.linkedin.ugc.ShareContent": {
                        shareCommentary: {
                            text: post.content
                        },
                        shareMediaCategory: post.media_urls?.length ? "IMAGE" : "NONE",
                        media: post.media_urls?.map(url => ({
                            status: "READY",
                            description: {
                                text: "Post image"
                            },
                            media: url, // LinkedIn usually requires URNs for media, this is a placeholder
                            title: {
                                text: "Image Content"
                            }
                        })) || []
                    }
                },
                visibility: {
                    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
                }
            };

            const response = await fetch(linkedInUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    "X-Restli-Protocol-Version": "2.0.0"
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`LinkedIn API error: ${JSON.stringify(errorData)}`);
            }

            const result = await response.json();
            return {
                success: true,
                platform: "linkedin",
                postId: result.id,
            };

        } catch (error: any) {
            console.error("LinkedIn publish error:", error);
            throw error;
        }
    }
}
