import { SocialPlatform } from "./types";
import { FacebookPlatform } from "./facebook";
import { InstagramPlatform } from "./instagram";
import { LinkedInPlatform } from "./linkedin";
import { TwitterPlatform } from "./twitter";
import { Platform } from "@/types";

export class PlatformFactory {
    static getPlatform(platformName: Platform): SocialPlatform {
        switch (platformName) {
            case "facebook":
                return new FacebookPlatform();
            case "instagram":
                return new InstagramPlatform();
            case "twitter":
                return new TwitterPlatform();
            case "linkedin":
                return new LinkedInPlatform();
            default:
                throw new Error(`Unsupported platform: ${platformName}`);
        }
    }
}
