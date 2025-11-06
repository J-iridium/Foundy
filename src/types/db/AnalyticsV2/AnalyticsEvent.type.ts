import type { BaseModel } from "../BaseModel.type";
import type { Device, Event } from "../Enums";

export interface AnalyticsEvent extends BaseModel {
  /** The site where this happened */
  site_id: string;

  /** The unique visitor */
  user_uuid?: string;

  /** Optional: related content (post, product, page, etc.) */
  content_id?: string;

  /** Type of event (e.g., view, click, scroll, checkout) */
  event_type: Event;

  /** Optional descriptive event name (like "add_to_cart", "video_play") */
  event_name?: string;

  /** The path where it occurred */
  path: string;

  /** HTTP referrer, if any */
  referrer?: string;

  /** Device type or platform */
  device?: Device;

  /** ISO country of visitor (snapshot) */
  country?: string;

  /** Browser user agent string */
  user_agent?: string;
}
