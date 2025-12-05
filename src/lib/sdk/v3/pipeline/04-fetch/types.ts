import type { ScanTask } from "../01-scan/types";

// The stautsses of fetchJobs
export type FetchStatus = "pending" | "fetching" | "completed" | "failed";

/**
 * A `FetchJob` represents a grouped request for one or more RawJobs that share 
 * a common content adress or can be fetched together as a collection.
 * 
 * Instead of issuing one API request per `RawJob` (which would be slow)
 * FetchJobs allow batching multiple related items into a single API call.
 * 
 * Example: 50 RawJobs for product:<title>:x can become 1 FetchJob that 
 * fetches a range of products (e.g. ID 0-50) in a single request.
 */
interface BaseFetchJob {
  address: string;            
  priority: number;
  tasks: ScanTask[];          // The original scan tasks waiting for this data
  
  // State tracking
  status: FetchStatus;
  isCached?: boolean;
  error?: Error | null;
}

// Specific Job for Named Items (e.g. "product:shoe1", "product:shoe2")
export interface KeyedFetchJob extends BaseFetchJob {
  kind: "keyed";              // The Discriminator
  keys: string[];             // The specific IDs/Names to fetch
}

// Specific Job for Ranges (e.g. "product:0-10")
export interface RangeFetchJob extends BaseFetchJob {
    kind: "range";              // The Discriminator
    range: [number, number];    // Start and End index
}


// The Exported Union Type
export type FetchJob = KeyedFetchJob | RangeFetchJob;

/**
 * The standard result object returning from the Fetch Phase.
 * It ties the original job to the result data.
 */
export interface FetchResult {
  job: FetchJob;
  data: any | null; // The raw data returned from the API
  success: boolean;
  error?: Error;
}

/**
 * Internal type for the prepared request options
 */
export interface RequestOptions {
  url: string;
  method: "GET" | "POST";
  body?: any;
  headers: Record<string, string>;
}
