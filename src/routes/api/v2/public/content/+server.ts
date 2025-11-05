import { withSiteAuth } from '$lib/server/withAuth';
import { ok, fail } from '$lib/server/http';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = withSiteAuth(async ({ auth, supabase, request }) => {
	try {
		// Optional: restrict content to the site associated with this token
		const site_id = auth.site_id; // comes from decoded SiteJwtClaims
		console.log(site_id)
		// Optional query params
		const url = new URL(request.url);
		const type = url.searchParams.get('type');
		const includeDrafts = url.searchParams.get('includeDrafts') === 'true';

		let query = supabase
			.from('content')
			.select('*')
			.eq('site_id', site_id)
			.order('created_at', { ascending: false });

		// Only show published content unless explicitly allowed
		if (!includeDrafts) {
			query = query.eq('status', 'Published');
		}

		// Optional content type filter
		// if (type) {
		// 	query = query.eq('type', type);
		// }

		const { data, error } = await query;
		console.log(data)
		if (error) return fail(400, 'Failed to fetch site content', error);
		return ok(data);
	} catch (err: any) {
		return fail(400, 'Failed to fetch content', err);
	}
});
