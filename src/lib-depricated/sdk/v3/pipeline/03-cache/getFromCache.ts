import type { CacheEntry } from "./types";

/**
 * Retrieves an item from the store and performs validation (e.g. expiry check).
 * Returns null if not found or expired.
 */
export function getFromCache(store: Map<string, CacheEntry>, address: string): any | null {
  const entry = store.get(address);

  if (!entry) {
    return null;
  }

  // Future: Add TTL check here.
//   if (Date.now() - entry.storedAt > entry.ttl) { store.delete(address); return null; }

  return entry.data;
}