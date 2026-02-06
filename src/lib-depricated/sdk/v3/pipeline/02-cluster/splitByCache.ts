import { cacheService } from "../03-cache/cacheService";
import type { ScanTask } from "../01-scan/types";
import type { CacheSplitResult } from "./types";


/**
 * Iterates through every task and asks the Cache Service if data exists.
 * Returns two clean arrays so they can be processed independently.
 */
export function splitByCache(tasks: ScanTask[]): CacheSplitResult {
    const cached: ScanTask[] = [];
    const uncached: ScanTask[] = [];

    for (const task of tasks) {
        if (cacheService.has(task.type, task.attributes.index!) || cacheService.has(task.address)) {
            cached.push(task);
        } else {
            uncached.push(task);
        }
    }

    return { cached, uncached };
}