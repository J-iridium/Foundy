import { json } from '@sveltejs/kit';
import { getServiceClient } from '$lib/supabase';

/** GET ?site_id=UUID */
export const GET = async ({ params, url, locals }) => {
    if (!locals.userJwt) return json({ error: 'Unauthorized' }, { status: 401 });
    const site_id = url.searchParams.get('site_id');
    if (!site_id) return json({ error: 'site_id required' }, { status: 400 });

    const supa = getServiceClient();
    const { data, error } = await supa
      .from('content')
      .select('*')
      .eq('site_id', site_id)
      .eq('name', params.name)
      .single();

    if (error) return json({ error: error.message }, { status: 404 });
    return json({ data });
};

/** PATCH body = partial { type?, data?, status? } + ?site_id=UUID */
export const PATCH = async ({ params, url, request, locals }) => {
    if (!locals.userJwt) return json({ error: 'Unauthorized' }, { status: 401 });
    const site_id = url.searchParams.get('site_id');
    if (!site_id) return json({ error: 'site_id required' }, { status: 400 });

    const updates = await request.json();
    const supa = getClientWithUserToken(locals.userJwt);
    const { data, error } = await supa
      .from('content')
      .update(updates)
      .eq('site_id', site_id)
      .eq('name', params.name)
      .select('*')
      .single();

    if (error) return json({ error: error.message }, { status: 400 });
    return json({ data });
};

/** DELETE ?site_id=UUID */
export const DELETE = async ({ params, url, locals }) => {
    if (!locals.userJwt) return json({ error: 'Unauthorized' }, { status: 401 });
    const site_id = url.searchParams.get('site_id');
    if (!site_id) return json({ error: 'site_id required' }, { status: 400 });

    const supa = getServiceClient();
    const { error } = await supa
      .from('content')
      .delete()
      .eq('site_id', site_id)
      .eq('name', params.name);

    if (error) return json({ error: error.message }, { status: 400 });
    return json({ success: true });
};
