// sdk/core/types.ts
import type { ContentSchemas } from "../../../types/generated/ContentSchemas"

export type ContentType = keyof typeof ContentSchemas;

export interface ContentItem {
  id: string;
  type: ContentType;
  data: any;
  created_at?: string;
}

export interface FoundySDKOptions {
  jwtToken: string;
  baseUrl?: string;
  dev?: boolean;
  autoHydrate?: boolean; // default true
  configScriptId?: string; // default "foundy-config"
}

export interface HydrationJob {
  el: HTMLElement;
  type: ContentType;
  name?: string;
  args?: { index : string, count : string};
  priority: number; // 0..10 integer
}
