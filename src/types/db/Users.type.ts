import type { BaseModel } from "./BaseModel.type";
import type { Role } from "./Enums";

/** Represents a user or team member within a company. */
export interface User extends BaseModel {
  /** The company this user belongs to */
  companyId: string;

  /** User's email address (used for login and notifications) */
  email: string;

  /** Full display name of the user */
  fullName: string;

  /** URL to the user's avatar image */
  avatarUrl: string;

  /** Assigned role (e.g., Owner, Editor, Viewer) */
  role: Role;

  /** User's password (used for login) */
  password: string;
}
