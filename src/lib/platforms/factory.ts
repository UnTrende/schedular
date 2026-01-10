import { SocialPlatform } from "./types";
import { FacebookPlatform } from "./facebook";
import { InstagramPlatform } from "./instagram";
import { Platform } from "@/types";

export class PlatformFactory {
    static getPlatform(platformName: Platform): SocialPlatform {
        switch (platformName) {
            case "facebook":
                return new FacebookPlatform();
            case "instagram":
                return new InstagramPlatform();
            case "twitter":
            case "linkedin":
                throw new Error(`${platformName} publishing not yet implemented`);
            default:
                throw new Error(`Unsupported platform: ${platformName}`);
        }
    }
}
