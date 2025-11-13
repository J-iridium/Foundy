import { withSiteAuth } from '$lib/server/withAuth';
import type { SiteJwtClaims } from '$lib/server/auth';
import { getServiceClient } from '$lib/supabase';
import { json } from '@sveltejs/kit';

export const GET = withSiteAuth(async ({ auth, supabase, request }) => {
  try {
    console .log(auth)
    const { siteId, domain, permissions } = auth;
    
    // has permission to read contents
    if (!permissions.includes('read:content')) {
      return json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Reffered domain should be the same as given inside of foundy
    const incomming = request.headers.get('host')
    if (!incomming?.includes(domain)) {
        console.log(domain)
        console.log(request.headers.get('host'))
        return json({error: 'Unauthorized'}, { status: 403});
    }


    // Optional query params: type and name
    const url = new URL(request.url);
    const typeFilter = url.searchParams.get('type'); // posts / products / media
    const nameFilter = url.searchParams.get('name'); // optional name filter

    let query = supabase
      .from('content')
      .select('id, type, data, created_at')
      .eq('site_id', siteId)
      .eq('status', 'Published')
      .order('created_at', { ascending: false });

    if (typeFilter) query = query.eq('type', typeFilter);
    if (nameFilter) query = query.ilike('data->>title', `%${nameFilter}%`); // assuming title in JSON field `data`

    const content = await query;

    if (content.error) {
      console.error('Supabase fetch error:', content.error);
      return json({ error: 'Failed to load content' }, { status: 500 });
    }

    return json({ data: content.data });
  } catch (err: any) {
    console.error('Public content endpoint error:', err);
    return json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
});
