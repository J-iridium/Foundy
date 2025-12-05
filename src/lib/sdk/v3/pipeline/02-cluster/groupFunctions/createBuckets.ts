// pipeline/02-cluster/groupFunctions/createBuckets.ts
import type { ScanTask } from "../../01-scan/types";
import type { GroupBucket } from "../types"; // Import from parent folder
import { baseAddress } from "./utils";

export function createBuckets(tasks: ScanTask[]): GroupBucket[] {
    const map = new Map<string, GroupBucket>();

    for (const task of tasks) {
        const key = baseAddress(task); 
        
        if (!map.has(key)) {
            map.set(key, {
                address: key,
                tasks: [],
                isRange: false,
                indexes: []
            });
        }

        const bucket = map.get(key)!;
        bucket.tasks.push(task);

        // Detect if this bucket should be treated as a Range
        if (task.attributes.count !== undefined || task.attributes.index !== undefined) {
            bucket.isRange = true;
        }
    }

    return Array.from(map.values());
}