import { withUserAuth } from '$lib/server/withAuth';
import { ok, fail } from '$lib/server/http';
import { HttpError } from '$lib/server/auth';
import type { RequestHandler } from './$types';

// Only receive your own companies data
export const GET: RequestHandler = withUserAuth(async ({ auth, supabase, request, params }) => {
  if (!auth) throw new HttpError(403, 'Forbidden');

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', auth.companyId)
    .single();
  console.log(auth, data)
  if (error) return fail(404, 'Company not found', error);
  return ok(data);
});

// only be able to patch you company data
export const PATCH: RequestHandler = withUserAuth(async ({ auth, supabase, request , params }) => {
  const { id } = params;
  if (!auth || auth.role !== 'owner')
    throw new HttpError(403, 'Forbidden');

  const body = await request.json();
  const { data, error } = await supabase
    .from('companies')
    .update(body)
    .eq('id', auth.companyId)
    .select('*')
    .single();

  if (error) return fail(400, 'Update failed', error);
  return ok(data);
});
