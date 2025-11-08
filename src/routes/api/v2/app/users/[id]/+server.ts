import { withUserAuth } from '$lib/server/withAuth';
import { ok, fail } from '$lib/server/http';
import { HttpError } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = withUserAuth(async ({ auth, supabase, request,params }) => {
  const { id } = params;
  if (auth.userId !== id && auth.role !== 'owner')
    throw new HttpError(403, 'Forbidden');

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .eq('company_id', auth.companyId)
    .single();

  if (error) return fail(404, 'User not found', error);
  return ok(data);
});

export const PATCH: RequestHandler = withUserAuth(async ({ auth, supabase, request , params}) => {
  const { id } = params;
  if (auth.userId !== id && auth.role !== 'owner')
    throw new HttpError(403, 'Forbidden');

  const body = await request.json();
  const { data, error } = await supabase
    .from('users')
    .update(body)
    .eq('id', id)
    .eq('company_id', auth.companyId)
    .select('*')
    .single();

  if (error) return fail(400, 'Update failed', error);
  return ok(data);
});
