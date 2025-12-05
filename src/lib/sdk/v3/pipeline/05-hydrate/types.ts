import type { ScanTask } from "../01-scan/types";

/**
 * A `HydrationJob` represents the final stage in the pipeline.
 * It pairs a resolved content fragment (from `FetchJob`) with the
 * specific DOM element that must be updated.
 * 
 * HydrateJobs execute quickly because they perform no fetching,
 * the simply read in-memory data and apply it to the DOM.
 */
export interface HydrateJob {
  task: ScanTask;             // The original requirement
  data: any;                  // The fulfilled data
  error?: Error | null;
}

/**
 * The type of hydration the element expects.
 * - "html": replace the element or its innerHTML entirely
 * - "element": inject JSON data into developer-defined structure
 */
export type HydrationMode = "html" | "element";
