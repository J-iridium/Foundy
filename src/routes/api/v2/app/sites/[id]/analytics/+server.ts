import { withUserAuth } from '../../../../../../../lib-depricated/server/withAuth';
import { ok, fail } from '../../../../../../../lib-depricated/server/http';
import { HttpError } from '../../../../../../../lib-depricated/server/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = withUserAuth(async ({ auth, supabase, request, params }) => {
  const { id } = params;
  const { data, error } = await supabase
    .from('analytics')
    .select('*')
    .eq('site_id', id)
    .single();
  if (error) return fail(404, 'Site not found', error);
  return ok(data);
});

export const POST: RequestHandler = withUserAuth(async ({ auth, supabase, params }) => {
  const { id } = params;
  if (auth.role !== 'owner')
    throw new HttpError(403, 'Only owner can create analytics record');

  const { data, error } = await supabase
    .from('analytics')
    .insert({ site_id: id, views: 0, visitors: 0 })
    .select()
    .single();

  if (error) return fail(500, 'Failed to create analytics record', error);

  return ok({ analytics: data });
});
