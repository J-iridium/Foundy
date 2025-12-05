// pipeline/02-cluster/groupFunctions/strategies/splitRange.ts
import type { GroupBucket } from "../../types";
import { getIndex } from "../utils";

export function splitRangeBuckets(bucket: GroupBucket): GroupBucket[] {
    if (!bucket.isRange) return [bucket];

    const indexedTasks = bucket.tasks
        .filter(t => getIndex(t) !== undefined)
        .sort((a, b) => (getIndex(a)!) - (getIndex(b)!));

    if (indexedTasks.length === 0) return [bucket];

    const MAX_ALLOWED_GAP = 25;
    const HARD_SPLIT_GAP = 100;
    const result: GroupBucket[] = [];
    
    let current: GroupBucket = {
        address: bucket.address,
        tasks: [indexedTasks[0]], 
        isRange: true,
        indexes: [getIndex(indexedTasks[0])!]
    };

    for (let i = 1; i < indexedTasks.length; i++) {
        const task = indexedTasks[i];
        const idx = getIndex(task)!;
        
        const prevTask = indexedTasks[i - 1];
        const prevIdx = getIndex(prevTask)!;

        const gap = idx - prevIdx;

        if (gap <= MAX_ALLOWED_GAP) {
            current.tasks.push(task);
            current.indexes.push(idx);
        } 
        else {
            result.push(current);
            current = {
                address: bucket.address,
                tasks: [task],
                isRange: true,
                indexes: [idx]
            };
        }
    }

    result.push(current);
    return result;
}