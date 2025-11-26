import type { base64 } from "$types/utils/base64.type";

export interface ImageData {
    title: string;
    image: base64;
    descriptionHtml: string;
}