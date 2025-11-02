import { json } from '@sveltejs/kit';
import { getClientWithUserToken } from '$lib/supabase';

/**
 * GET /api/v1/app/sites/[id]/token
 * Retrieve the current token for a site
 */
export const GET = async ({ params, locals }) => {
	try {
		if (!locals.userJwt) return json({ error: 'Unauthorized' }, { status: 401 });

		const { id } = params;
		const supa = getClientWithUserToken(locals.userJwt);

		const { data, error } = await supa
			.from('site_tokens')
			.select('id, site_id, token, revoked, created_at, last_used_at')
			.eq('site_id', id)
			.single();

		if (error) throw error;
		return json({ data });
	} catch (err: any) {
		console.error('Site token GET error:', err);
		return json({ error: err.message || 'Failed to fetch site token' }, { status: 500 });
	}
};
