import type { PipelineConfig } from "../../orchestra/types";
import type { FetchJob, RequestOptions, KeyedFetchJob, RangeFetchJob } from "./types";

/**
 * Factories the URL and Query Params based on the Job Type.
 */
export function buildRequest(job: FetchJob, config: PipelineConfig): RequestOptions {
  const headers = {
    "Content-Type": "application/json",
    ...(config.jwtToken ? { "Authorization": `Bearer ${config.jwtToken}` } : {})
  };

  if (job.kind === "keyed") {
    return buildKeyedRequest(job, config, headers);
  }

  if (job.kind === "range") {
    return buildRangeRequest(job, config, headers);
  }

  throw new Error(`[Foundy] Unknown job kind: ${(job as any).kind}`);
}

function buildKeyedRequest(job: KeyedFetchJob, config: PipelineConfig, headers: any): RequestOptions {
  const url = new URL(config.apiBaseUrl!);

  url.searchParams.append("type", job.address);
  url.searchParams.append("keys", job.keys.join(","));

  return {
    url: url.toString(),
    method: "GET",
    headers,
  };
}

function buildRangeRequest(job: RangeFetchJob, config: PipelineConfig, headers: any): RequestOptions {
  const url = new URL(config.apiBaseUrl!);

  url.searchParams.append("type", job.address);

  const [start, end] = job.range;
  url.searchParams.append("start", start.toString());
  url.searchParams.append("end", end.toString());

  return {
    url: url.toString(),
    method: "GET",
    headers
  };
}