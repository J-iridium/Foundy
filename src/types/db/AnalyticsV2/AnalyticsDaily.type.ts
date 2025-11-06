import type { BaseModel } from "../BaseModel.type";

export interface AnalyticsDaily extends BaseModel {
  /** Site this summary belongs to */
  site_id: string;

  /** Optional content grouping (post, product, etc.) */
  content_id?: string;

  /** Date for this aggregation (YYYY-MM-DD) */
  date: string;

  /** Total views (event_type='view') */
  views: number;

  /** Total clicks (event_type='click') */
  clicks: number;

  /** Total checkouts or conversions (event_type='checkout') */
  checkouts: number;

  /** Unique visitors that day */
  unique_visitors: number;

  /** Retention rate (average across visitors) */
  retention: number;

  /** Average session duration in seconds */
  avg_session_time: number;

  /** Country breakdowns, stored compactly as {"NL": 54, "DE": 12} */
  country_data?: Record<string, number>;

  /** Bounce rate (optional) */
  bounce_rate?: number;

  /** When this aggregation was last updated */
  updated_at: string;
}
