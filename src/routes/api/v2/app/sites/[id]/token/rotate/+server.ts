import { withUserAuth } from '$lib/server/withAuth';
import { ok, fail } from '$lib/server/http';
import { HttpError } from '$lib/server/auth';
import jwt from 'jsonwebtoken';
import { SUPABASE_JWT_SECRET } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = withUserAuth(async ({ auth, supabase, request, params }) => {
  const { id } = params;
  if (auth.role !== 'owner')
    throw new HttpError(403, 'Only owner can rotate tokens');

  const { data: site, error } = await supabase
    .from('sites')
    .select('id, domain, company_id')
    .eq('id', id)
    .eq('company_id', auth.company_id)
    .single();

  if (error || !site) return fail(404, 'Site not found', error);

  const token = jwt.sign(
    {
      company_id: site.company_id,
      site_id: site.id,
      domain: site.domain,
      permissions: ['read:content', 'write:content'],
    },
    SUPABASE_JWT_SECRET!,
    { expiresIn: '30d' }
  );

  return ok({ token, rotated: true });
});
