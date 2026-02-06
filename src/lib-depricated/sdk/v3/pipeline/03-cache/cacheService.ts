/**
 * src/pipeline/03-cache/cacheService.ts
 */
import type { CacheEntry, CacheItemInput } from "./types";
import { getFromCache } from "./getFromCache";
import { putToCache } from "./putToCache";

class CacheService {
    // Primary Storage (Map for O(1) Key Lookup)
    private store = new Map<string, CacheEntry>();
    
    // Secondary Index (Sorted Array for O(log n) Binary Search)
    private searchIndex: CacheEntry[] = [];

    private STORAGE_KEY = "foundy_cache_v1";
    private MAX_AGE = 1000 * 60 * 60; // 1 Hour

    constructor() {
        if (typeof window === 'undefined') return;
        this.load();
    }

    private load() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            
            if (saved) {
                const rawEntries: [string, CacheEntry][] = JSON.parse(saved);
                const now = Date.now();

                const freshEntries = rawEntries.filter(([_, entry]) => {
                    return (now - entry.storedAt) < this.MAX_AGE;
                });

                this.store = new Map(freshEntries);
                
                this.rebuildIndex();
            }
        } catch (e) {
            console.warn("[Foundy] Failed to load cache", e);
        }
    }

    /**
     * Re-generates the sorted array used for Binary Search.
     * Called automatically after set() or load().
     */
    private rebuildIndex() {
        const allEntries = Array.from(this.store.values());
        
        this.searchIndex = allEntries.filter(e => e.type && typeof e.index === 'number');

        this.searchIndex.sort((a, b) => {
            if (a.type !== b.type) {
                return (a.type! < b.type!) ? -1 : 1;
            }
            return (a.index! - b.index!);
        });
    }

    private persist() {
        if (typeof window === 'undefined') return;
        try {
            const json = JSON.stringify(Array.from(this.store.entries()));
            console.log("HELLO")
            localStorage.setItem(this.STORAGE_KEY, json);
        } catch (e) {
            console.warn("[Foundy] Cache full, could not save");
        }
    }

    // =========================================================
    // BINARY SEARCH IMPLEMENTATION
    // =========================================================
    
    /**
     * uses Binary Search (O(log n)) to find an item by Type + Index.
     */
    findRequest(type: string, index: number): CacheEntry | null {
        let low = 0;
        let high = this.searchIndex.length - 1;

        while (low <= high) {
            const mid = (low + high) >>> 1; 
            const entry = this.searchIndex[mid];

            if (entry.type! < type) {
                low = mid + 1;
                continue;
            }
            if (entry.type! > type) {
                high = mid - 1;
                continue;
            }

            if (entry.index! < index) {
                low = mid + 1;
            } else if (entry.index! > index) {
                high = mid - 1;
            } else {
                return entry; // Match Found!
            }
        }

        return null; // Not found
    }

    // =========================================================
    // PUBLIC API
    // =========================================================

    has(arg1: string, arg2?: number): boolean {
        if (typeof arg2 === 'number') {
            // Use Binary Search
            return this.findRequest(arg1, arg2) !== null;
        }

        // Use Map Lookup
        return this.store.has(arg1);
    }

    get(arg1: string, arg2?: number): any | null {
        if (typeof arg2 === 'number') {
            // Use Binary Search
            const match = this.findRequest(arg1, arg2);
            return match ? match.data : null;
        }
        // Use Map Lookup
        return getFromCache(this.store, arg1);
    }

    set(items: CacheItemInput | CacheItemInput[]): void {
        putToCache(this.store, items);
        
        this.rebuildIndex();
        this.persist();
    }

    clear(): void {
        this.store.clear();
        this.searchIndex = [];
        this.persist();
    }
}

export const cacheService = new CacheService();