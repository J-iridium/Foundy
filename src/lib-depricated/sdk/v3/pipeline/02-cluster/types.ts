import type { ScanTask } from "../01-scan/types";

export interface GroupBucket {
    address: string;
    tasks: ScanTask[];
    isRange: boolean;
    indexes: number[];
}


export interface CacheSplitResult {
    cached: ScanTask[];
    uncached: ScanTask[];
}