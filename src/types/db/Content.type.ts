import type { BaseModel } from "./BaseModel.type";
import type { ContentType, Status } from "./Enums";

export interface Content extends BaseModel {
  /** The site this content belongs to */
  siteId: string;

  /** Human-readable name or title of the content */
  name: string;

  /** Type of content (e.g., page, post, product) */
  type: ContentType;

  /** Content data stored as JSON (body, fields, metadata, etc.) */
  data: JSON;

  /** Current publication status (draft, published, archived, etc.) */
  status: Status;

  /** Last time this content was updated */
  updatedAt: string;
}
