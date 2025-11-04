import { withUserAuth } from '$lib/server/withAuth';
import { ok, fail } from '$lib/server/http';
import { HttpError } from '$lib/server/auth';
import type { RequestHandler } from './$types';
import { SUPABASE_JWT_SECRET } from '$env/static/private';
import jwt from 'jsonwebtoken'
import { SiteTokens } from '$lib/supabase';

export const GET: RequestHandler = withUserAuth(async ({ auth, supabase }) => {
  const { company_id } = auth;
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('company_id', company_id);
  if (error) return fail(400, 'Failed to fetch sites', error);
  return ok(data);
});

export const POST: RequestHandler = withUserAuth(async ({ auth, supabase, request, params }) => {
  if (auth.role !== 'owner')
    throw new HttpError(403, 'Only owner can create a site');

  const body = await request.json();
  const { name, domain } = body;

  // 1. Create site
  const { data: site, error: siteError } = await supabase
    .from('sites')
    .insert({ company_id: auth.company_id, name, domain })
    .select()
    .single();
  	
  (site.id)
  if (siteError) return fail(500, 'Failed to create site', siteError);
  // 2. Create analytics

  const { data: analytics, error: analyticsError } = await supabase
  .from('analytics')
  .insert({ site_id: site.id, views: 0, unique_visitors: 0, retention: 0})
  .select()
  .single();
  
  ('y')
  if (analyticsError) return fail(500, 'Failed to create analytics', analyticsError);

  // 3. Create site token
  const token = jwt.sign(
    {
      company_id: site.company_id,
      site_id: site.id,
      domain: site.domain,
      permissions: ['read:content'],
    },
    SUPABASE_JWT_SECRET!,
    { expiresIn: '365d' }
  );

  const { data: tokenData, error: tokenError } = await supabase
    .from('site_tokens')
    .insert({ site_id: site.id, token: token, permissions: ['read:content'] })
    .select()
    .single();

  ('z', tokenError)
  if (tokenError) return fail(500, 'Failed to create site token', tokenError);
  ('COMPLETE!')
  return ok({ site, analytics, token });
});
