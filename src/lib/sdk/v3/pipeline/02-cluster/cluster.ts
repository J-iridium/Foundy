// pipeline/02-cluster/cluster.ts

import type { ScanTask } from "../01-scan/types";
import type { FetchJob } from "../04-fetch/types";
import { splitByCache } from "./splitByCache";
import { processBatch } from "./processBatch";

export function cluster(allTasks: ScanTask[]): FetchJob[] {
    const { cached, uncached } = splitByCache(allTasks);

    const memoryJobs = processBatch(cached, true);
    const networkJobs = processBatch(uncached, false);
    console.log(cached)
    return [...memoryJobs, ...networkJobs];
}