import { withUserAuth } from '../../../../../../../lib-depricated/server/withAuth';
import { ok, fail } from '../../../../../../../lib-depricated/server/http';
import { HttpError } from '../../../../../../../lib-depricated/server/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = withUserAuth(async ({ auth, supabase, request , params}) => {
  const { id } = params;
  if (auth.companyId !== id) throw new HttpError(403, 'Forbidden');

  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role')
    .eq('company_id', id);

  if (error) return fail(400, 'Failed to fetch users', error);
  return ok(data);
});
