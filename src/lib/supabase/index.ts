import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_JWT_SECRET } from '$env/static/private';

export type UserJwtClaims = {
    user_id : string;
    company_id: string;
    role: 'owner' | 'editor' | 'viewer';
};

export type SiteJwtClaims = {
    company_id : string;
    site_id : string;
    domain : string;
    permissions: string[];
};

export function issueUserJWT(claims : UserJwtClaims, expiredIn ='1h') {
    return jwt.sign(claims, SUPABASE_JWT_SECRET, { expiresIn: expiredIn, issuer: 'foundy-cms'});
}

export function issueSiteJWT(claims : SiteJwtClaims, expiredIn = '365d') {
    return jwt.sign(claims, SUPABASE_JWT_SECRET, { expiresIn: expiredIn, issuer: 'foundy-cms'});
}


/** DEPRECATED 
 * Client that carries a custom Bearer token (JWT) 
**/
export function getClientWithUserToken(userToken: string): SupabaseClient {
    return createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    });
  }
  

/** Server-only: full power (bypasses RLS). Never expose this to the browser. */
export function getServiceClient(): SupabaseClient {
    return createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

/** ---------- Typed helpers (tenant-scoped via RLS claims) ---------- */

// export const Users = {
//     async getSelf(client : SupabaseClient) {
//         return client.from('users').select('*').limit(1).maybeSingle();
//     },
//     async listCompanyMembers(client: SupabaseClient) {
//         return client.from('users').select('id,email,full_name,avatar_url,role,created_at');
//     },
//     async updateSelf(client: SupabaseClient, patch: Partial<{ full_name: string; avatar_url: string }>) {
//         return client.from('users').update(patch).select('*').maybeSingle();
//     }
// };

// export const Sites = {
//     async list(client : SupabaseClient) {
//         return client.from('sites').select('id,name,domain,created_at');
//     },
//     async create(client : SupabaseClient, input : { name : string; domain : string; company_id? : string }) {
//         // RLS will enforce company_id == token.company_id if provided/required.
//         // TODO: figure out if the company_id required
//         return client.from('sites').insert({ name: input.name, domain: input.domain, company_id: input.company_id }).select('*').maybeSingle();
//     },
//     async update(client: SupabaseClient, siteId: string, patch: Partial<{ name: string; domain: string }>) {
//         return client.from('sites').update(patch).eq('id', siteId).select('*').maybeSingle();
//     },
//     async remove(client: SupabaseClient, siteId: string) {
//         return client.from('sites').delete().eq('id', siteId);
//     }
// };

// export const SiteTokens = {
//     async getBySite(client: SupabaseClient, siteId: string) {
//         return client.from('site_tokens').select('id,site_id,token,permissions,revoked,created_at,last_used_at').eq('site_id', siteId).maybeSingle();
//     },
//     // for owners via RLS (or service on server):
//     async revoke(client: SupabaseClient, siteId: string) {
//         return client.from('site_tokens').update({ revoked: true }).eq('site_id', siteId).select('*').maybeSingle();
//     }
// };

// /** ---------- Admin/Service actions (server-only) ---------- */

// export const Admin = {
//     /** Create a company; trigger may create default site; then issue a proper JWT and store it. */
//     async createCompanyWithDefaultSite(input: { name: string; domain: string; plan: string; whitelabel?: boolean }) {
//         const svc = getServiceClient();

//         // 1) create company
//         const {data: company, error: cErr} = await svc
//             .from('companies')
//             .insert({ name: input.name, domain: input.domain, plan: input.plan, whitelabel: !!input.whitelabel })
//             .select('*')
//             .single();
//         if (cErr) return { data: null, error: cErr };

//          // 2) find default site (created by your trigger) or create if no trigger
//         let { data: site } = await svc.from('sites').select('*').eq('company_id', company.id).eq('domain', company.domain).single();
//         if (!site) {
//         const res = await svc
//             .from('sites')
//             .insert({ company_id: company.id, name: `${company.name} Main Site`, domain: company.domain })
//             .select('*')
//             .single();
//             site = res.data!;
//         }

//         // 3) generate a real JWT for the site and store in site_tokens
//         const token = issueSiteJWT({ company_id: company.id, site_id: site.id, domain: site.domain, permissions: ['read:content'] });
//         const { data: existing } = await svc.from('site_tokens').select('id').eq('site_id', site.id).maybeSingle();
//         if (existing) {
//             await svc.from('site_tokens').update({ token, revoked: false, last_used_at: null }).eq('site_id', site.id);
//         } else {
//             await svc.from('site_tokens').insert({ site_id: site.id, token, permissions: ['read:content'] });
//         }

//         return { data: { company, site, token }, error: null };
//     },

//     /** Rotate a site's token (JWT) */
//     async rotateSiteToken(siteId: string) {
//         const svc = getServiceClient();
//         const { data: site, error: sErr } = await svc.from('sites').select('id,domain,company_id').eq('id', siteId).single();
//         if (sErr) return { data: null, error: sErr };
//         const token = issueSiteJWT({ company_id: site.company_id, site_id: site.id, domain: site.domain, permissions: ['read:content'] });
//         const { error } = await svc.from('site_tokens').update({ token, revoked: false, last_used_at: null }).eq('site_id', siteId);
//         return { data: { token }, error };
//     }
// }
