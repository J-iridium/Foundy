// pipeline/02-cluster/createClusters.ts

import type { ScanTask } from "../01-scan/types";
import type { FetchJob, KeyedFetchJob, RangeFetchJob } from "../04-fetch/types";
import type { GroupBucket } from "./types";

export function createClusters(buckets: GroupBucket[]): FetchJob[] {
    return buckets.map(bucket => {
        console.log(bucket)
        if (bucket.isRange) {
            const min = Math.min(...bucket.indexes);
            const max = Math.max(...bucket.indexes);
            return {
                kind: "range",
                address: bucket.address,
                range: [min, max],
                tasks: bucket.tasks,
                priority: Infinity,
                isCached: false,
                status: "pending"
            } as RangeFetchJob;
        }

        const keys = bucket.tasks
            .map(t => t.attributes.name!)
            .filter(Boolean);

        return {
            kind: "keyed",
            address: bucket.address,
            keys,
            tasks: bucket.tasks,
            priority: Infinity,
            isCached: false,
            status: "pending"
        } as KeyedFetchJob;
    });
}
