import { withUserAuth } from '$lib/server/withAuth';
import { ok, fail } from '$lib/server/http';
import { HttpError } from '$lib/server/auth';

export const GET = withUserAuth(async ({ auth, supabase }) => {
  const { company_id } = auth;
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', company_id)
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
    .insert([{ name, domain, owner_id: auth.user_id }])
    .select('*')
    .single();

  if (error) return fail(400, 'Failed to create company', error);
  return ok(data, 201);
});
