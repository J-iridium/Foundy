import { json } from '@sveltejs/kit';
import { getClientWithUserToken } from '$lib/supabase';

/**
 * GET /api/v1/app/sites/[id]
 * Retrieve one site
 */
export const GET = async ({ params, locals }) => {
	try {
		if (!locals.userJwt) return json({ error: 'Unauthorized' }, { status: 401 });

		const { id } = params;
		const supa = getClientWithUserToken(locals.userJwt);
		const { data, error } = await supa
			.from('sites')
			.select('*')
			.eq('id', id)
			.single();

		if (error) throw error;
		return json({ data });
	} catch (err: any) {
		console.error('Site GET error:', err);
		return json({ error: err.message || 'Failed to fetch site' }, { status: 500 });
	}
};

/**
 * PATCH /api/v1/app/sites/[id]
 * Update a site (name/domain)
 * Body: { name?, domain? }
 */
export const PATCH = async ({ request, params, locals }) => {
	try {
		if (!locals.userJwt) return json({ error: 'Unauthorized' }, { status: 401 });

		const { id } = params;
		const updates = await request.json();

		const supa = getClientWithUserToken(locals.userJwt);
		const { data, error } = await supa
			.from('sites')
			.update(updates)
			.eq('id', id)
			.select('*')
			.single();

		if (error) throw error;
		return json({ message: 'Site updated successfully', data });
	} catch (err: any) {
		console.error('Site PATCH error:', err);
		return json({ error: err.message || 'Failed to update site' }, { status: 500 });
	}
};

/**
 * DELETE /api/v1/app/sites/[id]
 * Delete a site
 */
export const DELETE = async ({ params, locals }) => {
	try {
		if (!locals.userJwt) return json({ error: 'Unauthorized' }, { status: 401 });

		const { id } = params;
		const supa = getClientWithUserToken(locals.userJwt);
		const { error } = await supa.from('sites').delete().eq('id', id);

		if (error) throw error;
		return json({ message: 'Site deleted successfully', success: true });
	} catch (err: any) {
		console.error('Site DELETE error:', err);
		return json({ error: err.message || 'Failed to delete site' }, { status: 500 });
	}
};
