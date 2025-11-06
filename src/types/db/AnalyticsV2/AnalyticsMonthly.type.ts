import type { BaseModel } from "../BaseModel.type";

export interface AnalyticsMonthly extends BaseModel {
  /** Site this summary belongs to */
  site_id: string;

  /** Optional content grouping */
  content_id?: string;

  /** The month represented (e.g., "2025-11-01") */
  month: string;

  /** Total views in that month */
  views: number;

  /** Total clicks in that month */
  clicks: number;

  /** Total checkouts/conversions */
  checkouts: number;

  /** Unique visitors for the month */
  unique_visitors: number;

  /** Average retention score */
  retention: number;

  /** Average session time (seconds) */
  avg_session_time: number;

  /** Aggregated country data, merged from daily stats */
  country_data?: Record<string, number>;

  /** When this aggregation was last updated */
  updated_at: string;
}
