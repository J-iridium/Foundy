import type { ContentType } from "$types/db";

/**
 * Represents a single item stored in the cache.
 * It wraps the actual data with metadata like creation time.
 */
export interface CacheEntry<T = any> {
  data: T;
  storedAt: number; // Timestamp in ms
  index?: number;   // The unique index when calling from <index-count>
  type?: ContentType;
}

/**
 * The structure expected by the putToCache function for batch inserts.
 */
export interface CacheItemInput {
  address: string; // The unique key (e.g., "product:shoe1")
  data: any;       // The raw data payload
  index?: number;   // The unique index when calling from <index-count>
  type? : ContentType;
}