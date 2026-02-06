// orchestra/context.ts
import type { PipelineConfig, PipelineContext } from "./types";

export function createPipelineContext(config: PipelineConfig): PipelineContext {
  return {
    config,

    scanTasks: [],
    fetchJobs: [],
    fetchResults: [],
  };
}
