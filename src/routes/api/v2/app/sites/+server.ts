import { withUserAuth } from '$lib/server/withAuth';
import { ok, fail } from '$lib/server/http';
import { HttpError } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = withUserAuth(async ({ auth, supabase }) => {
  const { company_id } = auth;
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('company_id', company_id);
  if (error) return fail(400, 'Failed to fetch sites', error);
  return ok(data);
});

export const POST: RequestHandler = withUserAuth(async ({ auth, supabase, request }) => {
  if (!['owner', 'editor'].includes(auth.role))
    throw new HttpError(403, 'Forbidden');

  const { name, domain } = await request.json();
  const { data, error } = await supabase
    .from('sites')
    .insert([{ company_id: auth.company_id, name, domain }])
    .select('*')
    .single();

  if (error) return fail(400, 'Failed to create site', error);
  return ok(data, 201);
});
