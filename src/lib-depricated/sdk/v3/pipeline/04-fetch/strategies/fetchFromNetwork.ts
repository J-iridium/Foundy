import type { FetchJob, FetchResult } from "../types";
import type { PipelineConfig } from "../../../orchestra/types";
import { buildRequest } from "../buildRequest";
import { sendRequest } from "../sendRequest";
import { handleResponse } from "../handleResponse";
import { cacheService } from "../../03-cache/cacheService";
import { normalizeForCache } from "../utils/normalizeForCache";

export async function fetchFromNetwork(
  job: FetchJob, 
  config: PipelineConfig, 
  timeout: number
): Promise<FetchResult> {
  try {
    const options = buildRequest(job, config);
    const rawResponse = await sendRequest(options, timeout);
    const data = await handleResponse(rawResponse);
    if (data && Array.isArray(data)) {
        const cacheInputs = normalizeForCache(data, job);
        console.log(cacheInputs)
        if (cacheInputs.length > 0) {
            cacheService.set(cacheInputs);
        }
    }

    return {
      job,
      data,
      success: true
    } as FetchResult;

  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown Network Error");
    
    job.error = err; 

    return {
      job,
      data: null,
      success: false,
      error: err
    } as FetchResult;
  }
}