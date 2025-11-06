import type { BaseModel } from "./BaseModel.type";

/** Represents a registered site belonging to a company. */
export interface Site extends BaseModel {
  /** The company this site belongs to */
  companyId: string;

  /** The domain or subdomain of the site */
  domain: string;
}
