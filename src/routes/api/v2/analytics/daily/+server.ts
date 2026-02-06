import { withSiteAuth } from '../../../../../lib-depricated/server/withAuth';
import { ok, fail } from '../../../../../lib-depricated/server/http';
import type { RequestHandler } from './$types';
import type { AnalyticsDaily } from '$types/db/AnalyticsV2/AnalyticsDaily.type';
import type { AnalyticsEvent } from '$types/db/AnalyticsV2/AnalyticsEvent.type';

export const POST: RequestHandler = withSiteAuth(async ({ auth, supabase, request }) => {
	try {
        let analytics : AnalyticsDaily = {
            site_id: auth.siteId,
            date: Date.now().toString(),
            views: 0,
            clicks: 0,
            checkouts: 0,
            unique_visitors: 0,
            retention: 0,
            avg_session_time: 0,
        };

        let query_fetch = supabase
			.from('analytics_event')
			.select('*')
			.eq('site_id', auth.siteId)

        let query_insert = supabase
            .from('analytics_daily')
            .insert(analytics)
            .single()
       
        const { data : fetchedEvents, error : fetchedError }  = await query_fetch;
        if (fetchedError) return fail(400, 'Failed to fetch analytic events', fetchedError);
        
        fetchedEvents as AnalyticsEvent[];
    
        analytics.unique_visitors = new Set(fetchedEvents.map(e => e.visitor_uuid)).size,
    
        fetchedEvents.forEach((event : AnalyticsEvent) => {
            if (event.event_type == "view") analytics.views++;
            if (event.event_type == "click") analytics.clicks++;
            if (event.event_type == "checkout") analytics.checkouts++;
        });
        

        const { data : insertedDaily, error : insertError } = await query_insert;

        if (insertError) return fail(400, 'Failed to insert analytic daily', insertError);
		return ok(insertedDaily);
	} catch (err: any) {
		return fail(400, 'Error occurred during data processing', err);
	}
});

export const GET: RequestHandler = withSiteAuth(async ({ auth, supabase, request }) => {
	try {
        let query_fetch = supabase
			.from('analytics_daily')
			.select('*')
			.eq('site_id', auth.siteId)
            .limit(31);

        const { data : fetchedEvents, error : fetchedError }  = await query_fetch;
        if (fetchedError) return fail(400, 'Failed to fetch analytic months', fetchedError);
        
        fetchedEvents as AnalyticsDaily[];
    
		return ok(fetchedEvents);
	} catch (err: any) {
		return fail(400, 'Error occurred during data processing', err);
	}
});