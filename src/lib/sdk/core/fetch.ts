import type { ContentItem, ContentType } from "./types";

export interface FetchOptions {
  baseUrl: string;
  apiUri: string;
  jwtToken: string | null;
  type: ContentType;
  name?: string;
  args?: {index : string, count: string};
  deviceId?: string;
  signal?: AbortSignal | null;
}

export async function fetchContent(opts: FetchOptions): Promise<ContentItem[] | null> {
  const { baseUrl, apiUri, jwtToken, type, name, args, deviceId, signal } = opts;
  if (!jwtToken) throw new Error("Missing JWT token for Foundy API");
  const url = new URL(apiUri, baseUrl);
  url.searchParams.append("type", type);
  
  if (name && !args) url.searchParams.append("name", name);
  if (args) {
    url.searchParams.append("index", args.index);
    url.searchParams.append("count", args.count);
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${jwtToken}`,
  };
  if (deviceId) headers["X-Device-ID"] = deviceId;
  const res = await fetch(url.toString(), {
    method: "GET",
    headers,
    signal: signal || undefined,
    credentials: "omit",
  });

  if (!res.ok) {
    // Try parse JSON error but don't throw a raw `res` to keep this module testable
    try {
      const j = await res.json();
      throw new Error(j?.error || `Foundy API error: ${res.status}`);
    } catch (err) {
      throw new Error(`Foundy API error: ${res.status}`);
    }
  }
  
  const json = await res.json();
  // expect { data: ContentItem[] }
  return json?.data ?? null;
}
