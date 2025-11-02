import { json } from '@sveltejs/kit';
import { getClientWithUserToken } from '$lib/supabase';

/** GET ?site_id=UUID&status=published|draft */
export const GET = async ({ url, locals }) => {
  if (!locals.userJwt) return json({ error: 'Unauthorized' }, { status: 401 });
  const site_id = url.searchParams.get('site_id');
  const status = url.searchParams.get('status') ?? undefined;

  const supa = getClientWithUserToken(locals.userJwt);
  let q = supa.from('content')
    .select('id,site_id,name,type,status,created_at,updated_at')
    .order('updated_at', { ascending: false });

  if (site_id) q = q.eq('site_id', site_id);
  if (status) q = q.eq('status', status);

  const { data, error } = await q;
  if (error) return json({ error: error.message }, { status: 400 });
  return json({ data });
};

/** POST { site_id, name, type, data, status? } */
export const POST = async ({ request, locals }) => {
  if (!locals.userJwt) return json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const supa = getClientWithUserToken(locals.userJwt);

  const { data, error } = await supa
    .from('content')
    .insert({
      site_id: body.site_id,
      name: body.name,
      type: body.type,
      data: body.data ?? {},
      status: body.status ?? 'draft'
    })
    .select('*')
    .single();

  if (error) return json({ error: error.message }, { status: 400 });
  return json({ data }, { status: 201 });
};
