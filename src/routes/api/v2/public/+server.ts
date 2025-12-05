import { withSiteAuth } from '$lib/server/withAuth';
import { json } from '@sveltejs/kit';

export const GET = withSiteAuth(async ({ auth, supabase, request }) => {
  try {
    const { siteId, domain, permissions } = auth;

    // 1. Permission Check
    if (!permissions.includes('read:content')) {
      return json({ error: 'Unauthorized: Missing read permissions' }, { status: 403 });
    }

    const origin = request.headers.get('origin') || request.headers.get('referer');
    const isDev = origin?.includes('localhost') || origin?.includes('127.0.0.1');
    
    // Strict check: The request must come from the actual user's site (or dev)
    if (!isDev && !origin?.includes(domain)) {
        return json({ error: `Unauthorized Origin: ${origin}` }, { status: 403 });
    }

    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    
    // SDK sends: ?keys=shoe1,shoe2,shoe3
    const namesParam = url.searchParams.get('keys'); 

    
    // SDK sends: ?start=0&end=10
    const start = parseInt(url.searchParams.get('start') ?? '0');
    const end = parseInt(url.searchParams.get('end') ?? '9');

    
    let query = supabase
      .from('content')
      .select('id, type, data, created_at')
      .eq('site_id', siteId)
      .eq('status', 'Published');

    
    if (type) {
        query = query.eq('type', type);
    }

    // =========================================================
    // STRATEGY A: Keyed Fetch (Batch by Name)
    // =========================================================
    if (namesParam) {
        const names = namesParam.split(',');
        
        // CRITICAL UPDATE: 
        // We look inside the JSON 'data' column for the field 'name'.
        // We use .in() to match ANY of the requested names.
        query = query.in('data->>name', names);
    } 
    
    // =========================================================
    // STRATEGY B: Range Fetch (Pagination)
    // =========================================================
    else {
        // Fetch a list (range) of items, ordered by creation
        query = query
            .range(start, end)
            .order('created_at', { ascending: false });
    }
    
    // 5. Execute
    const { data, error } = await query;

    if (error) {
      console.error('Supabase fetch error:', error);
      return json({ error: 'Failed to load content' }, { status: 500 });
    }

    return json({ data });

  } catch (err: any) {
    console.error('API Error:', err);
    return json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
});