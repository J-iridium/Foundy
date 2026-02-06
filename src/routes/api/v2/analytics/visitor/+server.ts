import { withSiteAuth } from '../../../../../lib-depricated/server/withAuth';
import { ok, fail } from '../../../../../lib-depricated/server/http';
import type { RequestHandler } from './$types';
import type { VisitorProfile } from '$types/db/AnalyticsV2/VisitorProfile.type';

/**
 * POST: Create or update a visitor profile
 */
export const POST: RequestHandler = withSiteAuth(async ({ auth, supabase, request }) => {
	try {
		const data = await request.json() as Partial<VisitorProfile>;
		if (!data.visitor_uuid) return fail(400, 'visitor_uuid is required');

		const now = new Date().toISOString();

		const { data: inserted, error } = await supabase
			.from('visitor_profiles')
			.upsert({
				visitor_uuid: data.visitor_uuid,
				site_id: auth.siteId,
				first_seen: data.first_seen || Date.now().toString(),
				last_seen: Date.now().toString(),
				country: data.country,
				region: data.region,
				city: data.city,
				retention_score: data.retention_score ?? 0
			})
			.select()
			.single();

		if (error) return fail(400, 'Failed to save visitor profile', error);

		return ok(inserted);
	} catch (err: any) {
		return fail(400, 'Error processing visitor profile', err);
	}
});

/**
 * GET: Return all visitor profiles for the current site
 */
export const GET: RequestHandler = withSiteAuth(async ({ auth, supabase }) => {
	try {
		const { data, error } = await supabase
			.from('visitor_profile')
			.select('*')
			.eq('site_id', auth.siteId)
			.order('last_seen', { ascending: false }); // newest first

		if (error) return fail(400, 'Failed to fetch visitor profiles', error);

		return ok(data);
	} catch (err: any) {
		return fail(400, 'Error retrieving visitor profiles', err);
	}
});
