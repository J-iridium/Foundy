// pipeline/02-cluster/groupFunctions/index.ts
import type { ScanTask } from "../../01-scan/types";
import type { GroupBucket } from "../types";
import { createBuckets } from "./createBuckets";
import { splitRangeBuckets } from "./strategies/splitRange";

/**
 * Main entry point for grouping logic.
 * 1. Creates raw buckets based on address.
 * 2. Applies range splitting strategies to optimize gaps.
 */
export function groupTasks(tasks: ScanTask[]): GroupBucket[] {
    const rawBuckets = createBuckets(tasks);
    return rawBuckets.flatMap(splitRangeBuckets);
}