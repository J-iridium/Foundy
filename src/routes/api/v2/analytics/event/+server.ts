import { withSiteAuth } from '../../../../../lib-depricated/server/withAuth';
import { ok, fail } from '../../../../../lib-depricated/server/http';
import type { RequestHandler } from './$types';
import type { AnalyticsEvent } from '$types/db/AnalyticsV2/AnalyticsEvent.type';

export const POST: RequestHandler = withSiteAuth(async ({ auth, supabase, request }) => {
	try {
        const requestUrl = new URL(request.url);
	    const type = requestUrl.searchParams.get('event-type') as string;
        const visitor = requestUrl.searchParams.get('uuid') as string;
        const content = requestUrl.searchParams.get('content-id') as string;

        let analytics : AnalyticsEvent = {
            site_id: auth.siteId,
            visitor_uuid: visitor,
            event_type: type,
            path: requestUrl.href,
            id: undefined,
            created_at: undefined
        };

        if (content) {
            analytics.content_id = content;
        }

        let query_insert = supabase
            .from('analytics_daily')
            .insert(analytics)
            .single()

        const { data : insertedDaily, error : insertError } = await query_insert;

        if (insertError) return fail(400, 'Failed to insert analytic event', insertError);
		return ok(insertedDaily);
	} catch (err: any) {
		return fail(400, 'Error occurred during data processing', err);
	}
});

export const GET: RequestHandler = withSiteAuth(async ({ auth, supabase }) => {
	try {
        const { data: events, error } = await supabase
            .from('analytics_daily')
            .select('*')
            .eq('site_id', auth.siteId) 
            .order('created_at', { ascending: false });

        if (error) return fail(400, 'Failed to fetch analytic events', error);

        return ok(events);
	} catch (err: any) {
		return fail(400, 'Error occurred during data retrieval', err);
	}
});