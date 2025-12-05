import { scan } from "../pipeline/01-scan/scan";
import { cluster } from "../pipeline/02-cluster/cluster";
import { executeFetch } from "../pipeline/04-fetch/fetchService";
import { hydrate, initHydration } from "../pipeline/05-hydrate/hydrate";
import { cacheService } from "../pipeline/03-cache/cacheService";
import type { ScanTask } from "../pipeline/01-scan/types";
import type { PipelineContext } from "./types";

export async function runPipeline(ctx: PipelineContext) {
  console.time("Pipeline"); 

  initHydration();

  ctx.scanTasks = scan();

  if (ctx.scanTasks.length === 0) {
    return;
  }

  ctx.fetchJobs = cluster(ctx.scanTasks);

  const executionPromises = ctx.fetchJobs.map(job => {
      return executeFetch(job, ctx.config, 500);
  });

  ctx.fetchResults = await Promise.all(executionPromises);

  for (const result of ctx.fetchResults) {
    const job = result.job;

    for (const task of job.tasks) {
      if (!result.success) {
        hydrate({ 
          task, 
          data: null, 
          error: result.error 
        });
        continue;
      }

      const data = getDataForTask(task);

      hydrate({ 
        task, 
        data: data, 
        error: data ? null : new Error("Data missing in batch") 
      });
    }
  }
  console.timeEnd("Pipeline");
  console.log(`[Foundy] Hydrated ${ctx.scanTasks.length} elements.`);
  console.log(ctx)
}

/**
 * Helper to look up data using the best available key (Index or Address)
 */
function getDataForTask(task: ScanTask): any {
  if (task.attributes.index !== undefined) {
    const fromIndex = cacheService.get(task.type, task.attributes.index);
    if (fromIndex) return fromIndex;
  }

  return cacheService.get(task.address);
}