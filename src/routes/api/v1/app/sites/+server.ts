import { json } from '@sveltejs/kit';
import { getClientWithUserToken , getServiceClient} from '$lib/supabase';

/**
 * GET /api/v1/app/sites
 * List all sites for the current user's company
 */
export const GET = async ({ locals }) => {
	try {
		if (!locals.userJwt) return json({ error: 'Unauthorized' }, { status: 401 });

		const supa = getServiceClient()
		const { data, error } = await supa
			.from('sites')
			.select('*')
		
		console.log(data)

		if (error) throw error;
		return json({ data });
	} catch (err: any) {
		console.error('Sites GET error:', err);
		return json({ error: err.message || 'Failed to fetch sites' }, { status: 500 });
	}
};

/**
 * POST /api/v1/app/sites
 * Create a new site under the user's company
 * Body: { name, domain }
 */
export const POST = async ({ request, locals }) => {
	try {
		if (!locals.userJwt) return json({ error: 'Unauthorized' }, { status: 401 });

		const { name, domain } = await request.json();
		if (!name || !domain)
			return json({ error: 'Name and domain are required.' }, { status: 400 });

		const supa = getClientWithUserToken(locals.userJwt);
		const { data, error } = await supa
			.from('sites')
			.insert({ name, domain })
			.select('*')
			.single();

		if (error) throw error;
		return json({ message: 'Site created successfully', data }, { status: 201 });
	} catch (err: any) {
		console.error('Sites POST error:', err);
		return json({ error: err.message || 'Failed to create site' }, { status: 500 });
	}
};
