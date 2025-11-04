import { withUserAuth } from '$lib/server/withAuth';
import { ok, fail } from '$lib/server/http';
import { HttpError } from '$lib/server/auth';
import jwt from 'jsonwebtoken';
import { SUPABASE_JWT_SECRET } from '$env/static/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = withUserAuth(async ({ auth, supabase, request, params }) => {
  const { id } = params;
  if (auth.role !== 'owner')
    throw new HttpError(403, 'Only owner can view site token');

  const { data: token, error } = await supabase
    .from('site_tokens')
    .select('id, site_id, token, revoked')
    .eq('site_id', id)
    .single();

  if (error || !token) return fail(404, 'Site not found', error);

  // console.log(token)

  return ok({ token });
});


export const POST: RequestHandler = withUserAuth(async ({ auth, supabase, params }) => {
  const { id } = params;
  if (auth.role !== 'owner')
    throw new HttpError(403, 'Only owner can create site token');

  // Generate JWT
  const token = jwt.sign(
    {
      site_id: id,
      permissions: ['read:content'],
    },
    SUPABASE_JWT_SECRET!,
    { expiresIn: '365d' }
  );

  const { data, error } = await supabase
    .from('site_tokens')
    .insert({ site_id: id, token })
    .select()
    .single();

  if (error) return fail(500, 'Failed to create site token', error);

  return ok({ token: data });
});