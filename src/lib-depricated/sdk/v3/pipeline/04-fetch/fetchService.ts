// src/pipeline/04-fetch/fetchService.ts
import type { FetchJob, FetchResult } from "./types";
import type { PipelineConfig } from "../../orchestra/types";
import { fetchFromCache } from "./strategies/fetchFromCache";
import { fetchFromNetwork } from "./strategies/fetchFromNetwork";

export async function executeFetch(
  job: FetchJob, 
  config: PipelineConfig, 
  timeout: number = 5000
): Promise<FetchResult> {
  
  job.status = "fetching";

  if (job.isCached) {
    const result = fetchFromCache(job);
    job.status = result.success ? "completed" : "failed";
    return result;
  }

  const result = await fetchFromNetwork(job, config, timeout);
  job.status = result.success ? "completed" : "failed";
  return result;
}