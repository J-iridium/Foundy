import type { BaseModel } from "../BaseModel.type";


export interface AnalyticsSession extends BaseModel {
    /** Site this user is active on */
    site_id: string;
  
    /** Visitor UUID */
    user_uuid: string;
  
    /** Page path (e.g., /blog/post-title) */
    path: string;
  
    /** When the user connected */
    connected_at: string;
  
    /** Last heartbeat ping time */
    last_ping: string;
  }
  