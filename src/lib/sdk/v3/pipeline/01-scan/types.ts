import type { ContentType } from "$types/db";

/**
 * A `Task` represents a single DOM element discovered during the scanning process.
 * It contains only structural information extraced form the element's data
 * attrivute and contextual DOM placement
 * 
 * Tasks do NOT perform fetching or hydration events. They are pure metadata describing
 * what content the element requires and how it relates to the rest of the document.
 * 
 * Tasks are later grouped into `FetchJobs` to avoid redundant API requests.
 */
export interface ScanTask {
  address: string;
  type: ContentType;
  mode: HydrationMode;
  attributes: Attributes;

  element: HTMLElement;
  parent?: HTMLElement | null;
}

/**
 * The type of hydration the element expects.
 * - "html": replace the element or its innerHTML entirely
 * - "element": inject JSON data into developer-defined structure
 */
export type HydrationMode = "html" | "element";

export interface Attributes {
    name? : string,
    nestedContents? : string[]
    index? : number,
    count? : number,
}