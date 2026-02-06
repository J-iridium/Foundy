import { withUserAuth } from '../../../../../lib-depricated/server/withAuth';
import { ok, fail } from '../../../../../lib-depricated/server/http';
import { HttpError } from '../../../../../lib-depricated/server/auth';

export const GET = withUserAuth(async ({ auth, supabase }) => {
  const { companyId } = auth;
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyId)
    .single();
  if (error) return fail(400, 'Failed to fetch company', error);
  return ok(data);
});

export const POST = withUserAuth(async ({ auth, supabase, request }) => {
  if (auth.role !== 'owner')
    throw new HttpError(403, 'Only owners can create companies');

  const body = await request.json();
  const { name, domain } = body;

  const { data, error } = await supabase
    .from('companies')
    .insert([{ name, domain, owner_id: auth.userId }])
    .select('*')
    .single();

  if (error) return fail(400, 'Failed to create company', error);
  return ok(data, 201);
});
