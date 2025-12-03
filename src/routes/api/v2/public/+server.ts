import { withSiteAuth } from '$lib/server/withAuth';
import type { SiteJwtClaims } from '$lib/server/auth';
import { getServiceClient } from '$lib/supabase';
import { json } from '@sveltejs/kit';

export const GET = withSiteAuth(async ({ auth, supabase, request, params }) => {
  try {
    const { siteId, domain, permissions } = auth;
    
    // has permission to read contents
    if (!permissions.includes('read:content')) {
      return json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Reffered domain should be the same as given inside of foundy
    const incomming = request.headers.get('host')
    if (!incomming?.includes(domain)) {
        return json({error: 'Unauthorized'}, { status: 403});
    }


    // Optional query params: type and name
    const url = new URL(request.url);
    const typeFilter : string = url.searchParams.get('type') as string; // posts / products / media
    const nameFilter : string  = url.searchParams.get('name') as string; // optional name filter
    const indexFilter : number = parseInt(url.searchParams.get('index') as string) ?? 0; // optional index filter
    const countFilter : number = parseInt(url.searchParams.get('count') as string) > 0 ? 
    parseInt(url.searchParams.get('count') as string) - 1 : 0; // optional index filter
    
    let query = supabase
      .from('content')
      .select('id, type, data, created_at')
      .eq('site_id', siteId)
      .eq('status', 'Published')
      .order('created_at', { ascending: false });

    if (typeFilter) query = query.eq('type', typeFilter);
    if (nameFilter) query = query.ilike('data->>title', `%${nameFilter}%`); // assuming title in JSON field `data`
    if (countFilter) {
      const startingIndex = indexFilter * countFilter;
      const endingIndex = (indexFilter + 1) * countFilter;

      query = query.range(startingIndex,endingIndex);
    }
    else if (indexFilter) {
      query = query.range(indexFilter,indexFilter);
    }
    
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
