import type { base64 } from "$types/utils/base64.type";

export interface PostData {
    title: string;
    description?: string;
    contentHtml: string;
    coverImage?: base64;
    tags?: string[];
  }
  