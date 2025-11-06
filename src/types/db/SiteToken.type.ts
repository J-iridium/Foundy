import type { BaseModel } from "./BaseModel.type";
import type { Permissions } from "./Enums";

/** Represents an API or access token for a specific site. */
export interface SiteToken extends BaseModel {
  /** The site this token belongs to */
  siteId: string;

  /** The token string used for authentication */
  token: string;

  /** List of granted permissions (e.g. ["read", "write"]) */
  permissions: Permissions[];

  /** Whether the token has been revoked */
  revoked: boolean;

  /** Number of API requests made with this token */
  requests: number;

  /** Last time this token was used */
  lastUsedAt: string;
}
