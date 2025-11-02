// src/lib/server/auth.ts
import jwt from 'jsonwebtoken';
import { SUPABASE_JWT_SECRET } from '$env/static/private';

export type Role = 'owner' | 'editor' | 'viewer';

export type UserCookies = {
    user_id : string;
    company_id: string;
    role: Role;
};

export type SiteJwtClaims = {
    company_id : string;
    site_id : string;
    domain : string;
    permissions: string[];
};

export class HttpError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function extractBearer(req: Request): string {
  const h = req.headers.get('authorization');
  if (!h) throw new HttpError(401, 'Missing Authorization header');
  const m = h.match(/^Bearer\s+(.+)$/i);
  if (!m) throw new HttpError(401, 'Malformed Authorization header');
  return m[1];
}

/**
 * Accepts either:
 *  - flat payload   { company_id, user_id, role }
 *  - nested payload { claims: { company_id, user_id, role } }
 */
export function verifyUserJWT(token: string): UserCookies {
    const payload = jwt.verify(token, SUPABASE_JWT_SECRET!) as UserCookies;
    if (!payload.user_id || !payload.company_id || !payload.role)
      throw { status: 403, message: 'Invalid user token structure' };
    return payload;
}
  
export function verifySiteJWT(token: string): SiteJwtClaims {
    const payload = jwt.verify(token, SUPABASE_JWT_SECRET!) as SiteJwtClaims;
    if (!payload.company_id || !payload.site_id || !payload.domain)
      throw { status: 403, message: 'Invalid site token structure' };
    return payload;
}

/** Convenience: parse from request */
// export function getUserAuthFromRequest(req: Request): UserCookies {
//   const token = extractBearer(req);
//   return verifyUserJWT(token);
// }

export function getSiteAuthFromRequest(req: Request): SiteJwtClaims {
    const token = extractBearer(req);
    return verifySiteJWT(token);
}