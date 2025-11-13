// @ts-ignore
import jwt from 'jsonwebtoken';
import { SUPABASE_JWT_SECRET } from '$env/static/private';
import type { SessionUser } from '$types/tokens';
import { validatePayloadKeys } from './payloadChecker';

export type SiteJwtClaims = {
    companyId : string;
    siteId : string;
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


export function verifyUserJWT(token: string): SessionUser {
    const payload = jwt.verify(token, SUPABASE_JWT_SECRET!) as SessionUser;
    validatePayloadKeys<SessionUser>(payload, ['userId', 'userName', 'companyId', 'role']);
    return payload;
}
  
export function verifySiteJWT(token: string): SiteJwtClaims {
    const payload = jwt.verify(token, SUPABASE_JWT_SECRET!) as SiteJwtClaims;
    validatePayloadKeys<SiteJwtClaims>(payload, ['siteId', 'domain', 'permissions']);
    return payload;
}

/** Convenience: parse from request */
export function getSiteAuthFromRequest(req: Request): SiteJwtClaims {
    const token = extractBearer(req);
    return verifySiteJWT(token);
}