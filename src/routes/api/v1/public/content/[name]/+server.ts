import { json } from '@sveltejs/kit';
import { getClientWithUserToken } from '$lib/supabase';

/** GET public content by name for a given site token (Authorization: Bearer <site_token>) */
export const GET = async ({ params, request }) => {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return json({ error: 'Missing site token' }, { status: 401 });

  // token is a JWT with site_id claim per jouw issuance
  const supa = getClientWithUserToken(token);

  // Alleen published content uitdienen
  const { data, error } = await supa
    .from('content')
    .select('name,type,data,updated_at')
    .eq('name', params.name)
    .eq('status', 'published')
    .single();

  if (error) return json({ error: 'Not found' }, { status: 404 });
  return json({ data });
};
