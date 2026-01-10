import { SocialPlatform, PublishResult } from "./types";
import { ScheduledPost } from "@/types";

export class InstagramPlatform implements SocialPlatform {
    private readonly P_API_VERSION = "v21.0";

    async publish(
        post: ScheduledPost,
        accessToken: string,
        instagramAccountId: string
    ): Promise<PublishResult> {
        try {
            if (!post.media_urls || post.media_urls.length === 0) {
                throw new Error("Instagram requires at least one image or video");
            }

            console.log(`Starting Instagram publish flow for account: ${instagramAccountId}`);

            // Step 1: Create media container
            const containerId = await this.createContainer(post, accessToken, instagramAccountId);
            console.log(`Instagram container created: ${containerId}`);

            // Step 2: Poll for status
            // Note: Ideally this should be split into separate tasks to avoid paying for wait time,
            // but for this refactor we are encapsulating existing logic.
            await this.waitForMedia(containerId, accessToken);

            // Step 3: Publish
            const publishId = await this.publishContainer(containerId, accessToken, instagramAccountId);

            return {
                success: true,
                platform: "instagram",
                postId: publishId,
            };

        } catch (error: any) {
            console.error("Instagram publish error:", error);
            throw error;
        }
    }

    private async createContainer(post: ScheduledPost, accessToken: string, accountId: string): Promise<string> {
        const mediaUrl = post.media_urls[0];
        const containerUrl = `https://graph.facebook.com/${this.P_API_VERSION}/${accountId}/media`;

        const payload = {
            image_url: mediaUrl,
            caption: post.content,
            access_token: accessToken,
        };

        const response = await fetch(containerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Instagram container creation error: ${JSON.stringify(errorData)}`);
        }

        const result = await response.json();
        return result.id;
    }

    private async waitForMedia(containerId: string, accessToken: string): Promise<void> {
        let isReady = false;
        let retries = 0;
        const maxRetries = 10;

        while (!isReady && retries < maxRetries) {
            // 3s wait
            await new Promise(resolve => setTimeout(resolve, 3000));

            const statusUrl = `https://graph.facebook.com/${this.P_API_VERSION}/${containerId}?fields=status_code&access_token=${accessToken}`;
            const response = await fetch(statusUrl);
            const data = await response.json();

            if (data.status_code === 'FINISHED') {
                isReady = true;
            } else if (data.status_code === 'ERROR') {
                throw new Error("Media processing failed by Instagram.");
            } else {
                console.log(`Instagram media status: ${data.status_code}. Retrying...`);
                retries++;
            }
        }

        if (!isReady) {
            throw new Error("Instagram media processing timed out.");
        }
    }

    private async publishContainer(containerId: string, accessToken: string, accountId: string): Promise<string> {
        const publishUrl = `https://graph.facebook.com/${this.P_API_VERSION}/${accountId}/media_publish`;
        const payload = {
            creation_id: containerId,
            access_token: accessToken,
        };

        const response = await fetch(publishUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Instagram publish error: ${JSON.stringify(errorData)}`);
        }

        const result = await response.json();
        return result.id;
    }
}
