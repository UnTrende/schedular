import { ScheduledPost } from "@/types";

export interface PublishResult {
    success: boolean;
    platform: string;
    postId?: string;
    error?: string;
}

export interface SocialPlatform {
    publish(
        post: ScheduledPost,
        accessToken: string,
        platformUserId: string
    ): Promise<PublishResult>;
}
