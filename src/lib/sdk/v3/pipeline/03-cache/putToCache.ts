import type { CacheEntry, CacheItemInput } from "./types";

/**
 * Inserts one or many items into the store.
 * Wraps raw data into CacheEntry objects with timestamps.
 */
export function putToCache(store: Map<string, CacheEntry>, items: CacheItemInput | CacheItemInput[]): void {
  const now = Date.now();
  const inputs = Array.isArray(items) ? items : [items];

  for (const input of inputs) {
      store.set(input.address, {
          data: input.data,
          storedAt: now,
          index: input.index!,
          type: input.type!
      });
  }
}