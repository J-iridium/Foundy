import type { BaseModel } from "../BaseModel.type";
import type { ContentType, Status } from "../Enums";
import type { ContentDataFor } from "./ContentDataFor.type";

export interface ContentOf<T extends ContentType> extends BaseModel {
  /** The site this content belongs to */
  siteId: string;

  /** Human-readable name or title of the content */
  name: string;

  /** Type of content (e.g., page, post, product) */
  type: T;

  /** Content data stored as JSON (body, fields, metadata, etc.) */
  data: ContentDataFor<T>;

  /** Current publication status (draft, published, archived, etc.) */
  status: Status;

  /** Last time this content was updated */
  updatedAt: string;
}
