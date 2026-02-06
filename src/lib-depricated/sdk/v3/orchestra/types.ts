// orchestra/types.ts

import type { ScanTask } from "../pipeline/01-scan/types";
import type { FetchJob, FetchResult } from "../pipeline/04-fetch/types";
import type { HydrateJob } from "../pipeline/05-hydrate/types";

export interface PipelineConfig {
  jwtToken: string;
  apiBaseUrl?: string;  // optional because you may hardcode it inside fetchService
}

export interface PipelineContext {
  config: PipelineConfig;

  // Runtime pipeline state
  scanTasks: ScanTask[];
  fetchJobs: FetchJob[];
  fetchResults: FetchResult[];
}
