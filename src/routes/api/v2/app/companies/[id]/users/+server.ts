import { withUserAuth } from '$lib/server/withAuth';
import { ok, fail } from '$lib/server/http';
import { HttpError } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = withUserAuth(async ({ auth, supabase, request , params}) => {
  const { id } = params;
  if (auth.company_id !== id) throw new HttpError(403, 'Forbidden');

  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role')
    .eq('company_id', id);

  if (error) return fail(400, 'Failed to fetch users', error);
  return ok(data);
});
