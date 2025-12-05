import { cacheService } from "../../03-cache/cacheService";
import type { FetchJob } from "../types";

/**
 * Strategy to retrieve data from memory based on Job Kind.
 */
export function readFromCache(job: FetchJob): any[] {
  const batchData: any[] = [];

  for (const task of job.tasks) {
    let item: any = null;

    if (job.kind === "range" && task.attributes.index !== undefined) {
      item = cacheService.get(task.type, task.attributes.index);
    } 
    else {
      item = cacheService.get(task.address);
    }

    if (item) {
      batchData.push(item);
    }
  }

  return batchData;
}