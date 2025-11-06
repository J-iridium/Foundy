import type { BaseModel } from "./BaseModel.type";

/** Represents basic analytics data for a specific site. */
export interface Analytics extends BaseModel {
  /** Total number of page views */
  views: number;

  /** Retention rate of page time */
  retention: number;

  /** The site this analytics record belongs to */
  siteId: string;

  /** Number of unique visitors */
  uniqueVisitors: number;
}
