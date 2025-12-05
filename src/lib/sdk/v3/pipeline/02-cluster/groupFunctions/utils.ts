// pipeline/02-cluster/groupFunctions/utils.ts
import type { ScanTask } from "../../01-scan/types";

export function getIndex(task: ScanTask): number | undefined {
    return task.attributes.index ?? task.attributes.count;
}

export function baseAddress(task: ScanTask): string {
    return task.type;  
}