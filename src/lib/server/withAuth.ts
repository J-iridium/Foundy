// src/lib/server/withAuth.ts
import { getServiceClient } from '$lib/supabase';
import { getSiteAuthFromRequest, type UserCookies, type SiteJwtClaims, HttpError } from './auth';
import { errorToResponse } from './http';
import { SUPABASE_JWT_SECRET } from '$env/static/private';
import type { RouteParams } from '$app/types';
import jwt from "jsonwebtoken"

export type Ctx<TClaims> = {
    request: Request;
    params: RouteParams;
    auth: TClaims;
    supabase: ReturnType<typeof getServiceClient>;

  };
  
  export type Handler<TClaims> = (ctx: Ctx<TClaims>) => Promise<Response>;

// withAuth.ts → for /api/v2/*
export function withUserAuth(handler: Handler<UserCookies>) {
  return async ({ request, cookies,params }) => {
    try {
      const token = cookies.get('session_user');
      if (!token) throw { status: 401, message: 'Not logged in' };
      const payload = jwt.verify(token, SUPABASE_JWT_SECRET!) as UserCookies;

      const auth: UserCookies = {
        user_id: payload.user_id,
        company_id: payload.company_id,
        role: payload.role,
      };

      const supabase = getServiceClient();
      return await handler({
        request, auth, supabase, params 
      });
    } catch (err) {
      return errorToResponse(err);
    }
  };
}
  
  // withSiteAuth.ts → for /api/site/*
  export function withSiteAuth(handler : Handler<SiteJwtClaims>) {
    return async ({ request, params}) => {
      try {
        const auth = getSiteAuthFromRequest(request);
        const supabase = getServiceClient();
        return await handler({
          request, auth, supabase, params
        });
      } catch (err) {
        return errorToResponse(err);
      }
    };
  }
  