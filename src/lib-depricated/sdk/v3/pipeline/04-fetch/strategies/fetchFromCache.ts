import type { FetchJob, FetchResult } from "../types";
import { readFromCache } from "../utils/readFromCache";

export function fetchFromCache(job: FetchJob): FetchResult {
  try {
    const data = readFromCache(job);
    
    return {
      job,
      data,
      success: true
    } as FetchResult;
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown Cache Error");
    
    return {
      job,
      data: null,
      success: false,
      error: err
    } as FetchResult;
  }
}