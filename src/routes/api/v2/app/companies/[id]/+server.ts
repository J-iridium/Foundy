import { withUserAuth } from '$lib/server/withAuth';
import { ok, fail } from '$lib/server/http';
import { HttpError } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = withUserAuth(async ({ auth, supabase, request, params }) => {
  const { id } = params;
  if (auth.company_id !== id) throw new HttpError(403, 'Forbidden');

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return fail(404, 'Company not found', error);
  return ok(data);
});

export const PATCH: RequestHandler = withUserAuth(async ({ auth, supabase, request , params }) => {
  const { id } = params;
  if (auth.company_id !== id || auth.role !== 'owner')
    throw new HttpError(403, 'Forbidden');

  const body = await request.json();
  const { data, error } = await supabase
    .from('companies')
    .update(body)
    .eq('id', id)
    .select('*')
    .single();

  if (error) return fail(400, 'Update failed', error);
  return ok(data);
});
