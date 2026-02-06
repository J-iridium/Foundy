import type { ScanTask } from "../01-scan/types";
import type { FetchJob } from "../04-fetch/types";

export function calculateFetchPriority(job: FetchJob): number {
  if (job.isCached) return Infinity;

  const minHydration = Math.min(...job.tasks.map((task : ScanTask) => task.priority));
  const clusterBonus = job.tasks.length > 10 ? -100 : 0;

  return minHydration + clusterBonus;
}
