import type { base64 } from "$types/utils/base64.type";

export interface FeaturedData {
    companyName : string;
    link? : string;
    logo : base64;
}