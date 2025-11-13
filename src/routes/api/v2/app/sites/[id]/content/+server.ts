import { withUserAuth } from '$lib/server/withAuth';
import { ok, fail } from '$lib/server/http';
import { HttpError } from '$lib/server/auth';

export const GET = withUserAuth(async ({ auth, supabase, params, request }) => {
	const { id: site_id } = params;
	const requestUrl = new URL(request.url);
	const type = requestUrl.searchParams.get('type');

	if (!['owner', 'editor', 'viewer'].includes(auth.role))
		throw new HttpError(403, 'Insufficient permissions');

	let query = supabase
		.from('content')
		.select('*')
		.eq('site_id', site_id)
		.order('created_at', { ascending: false });

	if (type) {
		query = query.eq('type', type);
	}

	const { data, error } = await query;

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
		.insert([{ site_id, name, type, data, status }])
		.select('*')
		.single();
	if (error) return fail(400, 'Failed to create content', error);
	return ok(inserted, 201);
});

export const PATCH = withUserAuth(async ({ auth, supabase, params, request }) => {
	const { id: site_id } = params;
	if (!['owner', 'editor'].includes(auth.role))
		throw new HttpError(403, 'Insufficient permissions');

	const url = new URL(request.url);
	const name = url.searchParams.get('name'); // ?name=<id or slug>
	if (!name) throw new HttpError(400, 'Missing ?name parameter');

	const updates = await request.json();

	const { data, error } = await supabase
		.from('content')
		.update(updates)
		.eq('site_id', site_id)
		.eq('id', name) // if your 'name' param is the UUID (id), this works
		.select('*')
		.single();

	if (error) {
		console.error('❌ Supabase update error:', error);
		return fail(400, 'Failed to update content', error);
	}

	return ok(data);
});

export const DELETE = withUserAuth(async ({ auth, supabase, params, request }) => {
	const { id: site_id } = params;
	if (!['owner', 'editor'].includes(auth.role))
		throw new HttpError(403, 'Insufficient permissions');

	const body = await request.json();
	const { content_id } = body;
	if (!content_id) throw new HttpError(400, 'Missing required field: content_id');

	const { error } = await supabase
		.from('content')
		.delete()
		.eq('id', content_id)
		.eq('site_id', site_id);

	if (error) return fail(400, 'Failed to delete content', error);
	return ok({ success: true });
});

