import type { BaseModel } from "./BaseModel.type";
import type { Plan } from "./Enums";

export interface Company extends BaseModel {
  /** Company name, e.g. "Pixel Studio" */
  name: string;

  /** Domain or subdomain used by the company */
  domain: string;

  /** Active subscription plan (Starter, Pro, etc.) */
  plan: Plan;

  /** Whether the dashboard is white-labeled */
  whiteLabel: boolean;

  /** Short company description or tagline */
  description: string;
}
