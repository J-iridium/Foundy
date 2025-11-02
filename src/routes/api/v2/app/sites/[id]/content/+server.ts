import { withUserAuth } from '$lib/server/withAuth';
import { ok, fail } from '$lib/server/http';
import { HttpError } from '$lib/server/auth';

export const GET = withUserAuth(async ({ auth, supabase, params }) => {
	const { id: site_id } = params;

	const { data, error } = await supabase
		.from('content')
		.select('*')
		.eq('site_id', site_id)
		.eq('company_id', auth.company_id);

	if (error) return fail(400, 'Failed to fetch content', error);
	return ok(data);
});

export const POST = withUserAuth(async ({ auth, supabase, params, request }) => {
	const { id: site_id } = params;
	if (!['owner', 'editor'].includes(auth.role))
		throw new HttpError(403, 'Insufficient permissions');

	const body = await request.json();
	const { name, type, status = 'draft', data } = body;

	if (!name || !type) throw new HttpError(400, 'Missing required fields');

	const { data: inserted, error } = await supabase
		.from('content')
		.insert([{ site_id, name, type, status, data }])
		.select('*')
		.single();

	if (error) return fail(400, 'Failed to create content', error);
	return ok(inserted, 201);
});
