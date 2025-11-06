import type { BaseModel } from "../BaseModel.type";

export interface UserProfile extends BaseModel {
  /** Unique identifier for this visitor (cookie or UUID) */
  user_uuid: string;

  /** The site this user belongs to */
  site_id: string;

  /** First time this visitor was seen */
  first_seen: string;

  /** Most recent time they visited */
  last_seen: string;

  /** ISO country code, e.g., 'NL' or 'US' */
  country?: string;

  /** Optional region or state */
  region?: string;

  /** Optional city name */
  city?: string;

  /** Retention score (0.0–1.0) */
  retention_score: number;
}
