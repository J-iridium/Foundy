import { withSiteAuth } from '../../../../../../lib-depricated/server/withAuth';
import { ok, fail } from '../../../../../../lib-depricated/server/http';
import type { RequestHandler } from './$types';
import type { VisitorProfile } from '$types/db/AnalyticsV2/VisitorProfile.type';

/**
 * GET: Return all visitor profiles for the current site
 */
export const GET: RequestHandler = withSiteAuth(async ({ auth, supabase, params}) => {
	try {
		const { id } = params;
		const { data, error } = await supabase
			.from('visitor_profile')
			.select('*')
			.eq('id', id)
			.single();

		if (error) return fail(400, 'Failed to fetch visitor profiles', error);

		return ok(data as VisitorProfile);
	} catch (err: any) {
		return fail(400, 'Error retrieving visitor profiles', err);
	}
});