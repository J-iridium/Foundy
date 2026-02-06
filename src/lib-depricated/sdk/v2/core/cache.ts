import type { ContentItem } from "./types";

/**
 * Simple in-memory cache with optional TTL.
 * You can later extend this to use IndexedDB/localStorage or LRU.
 */
type CacheEntry = {
  value: ContentItem[];
  expiresAt?: number | null;
};

export class SimpleCache {
  private store = new Map<string, CacheEntry>();
  private defaultTTL = 1000 * 60 * 5; // 5min default

  get(key: string): ContentItem[] | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key: string, value: ContentItem[], ttlMs?: number | null) {
    const expiresAt = ttlMs === null ? null : Date.now() + (ttlMs ?? this.defaultTTL);
    this.store.set(key, { value, expiresAt });
  }

  clear(key?: string) {
    if (!key) {
      this.store.clear();
    } else {
      this.store.delete(key);
    }
  }
}
