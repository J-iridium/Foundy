import { withUserAuth } from '$lib/server/withAuth';
import { ok, fail } from '$lib/server/http';
import { HttpError } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = withUserAuth(async ({ auth, supabase, request, params }) => {
  const { id } = params;
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', id)
    .eq('company_id', auth.company_id)
    .single();
  if (error) return fail(404, 'Site not found', error);
  return ok(data);
});

export const PATCH: RequestHandler = withUserAuth(async ({ auth, supabase, request , params}) => {
  const { id } = params;
  if (!['owner', 'editor'].includes(auth.role))
    throw new HttpError(403, 'Forbidden');

  const body = await request.json();
  const { data, error } = await supabase
    .from('sites')
    .update(body)
    .eq('id', id)
    .eq('company_id', auth.company_id)
    .select('*')
    .single();

  if (error) return fail(400, 'Update failed', error);
  return ok(data);
});
