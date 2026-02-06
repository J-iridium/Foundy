// pipeline/02-cluster/processBatch.ts

import type { ScanTask } from "../01-scan/types";
import type { FetchJob } from "../04-fetch/types";
import { groupTasks } from "./groupFunctions/index";
import { createClusters } from "./createClusters";
import { calculateFetchPriority } from "./calculateFetchPriority";

/**
 * Standardizes the workflow: Group -> Cluster -> Configure.
 * Used for both the "Memory Lane" and the "Network Lane".
 */
export function processBatch(tasks: ScanTask[], isCached: boolean): FetchJob[] {
    if (tasks.length === 0) return [];
    const groupedBuckets = groupTasks(tasks);
    const jobs = createClusters(groupedBuckets);
    
    for (const job of jobs) {
        job.isCached = isCached;
        job.status = "pending";
        job.priority = calculateFetchPriority(job);
    }

    return jobs;
}