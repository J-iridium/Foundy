import { withUserAuth } from '$lib/server/withAuth';
import { ok, fail } from '$lib/server/http';
import { HttpError } from '$lib/server/auth';

export const PATCH = withUserAuth(async ({ auth, supabase, params, request }) => {
	const { id: site_id, name } = params;
	if (!['owner', 'editor'].includes(auth.role))
		throw new HttpError(403, 'Insufficient permissions');

	const updates = await request.json();

	const { data, error } = await supabase
		.from('content')
		.update(updates)
		.eq('site_id', site_id)
		.eq('name', name)
		.eq('company_id', auth.company_id)
		.select('*')
		.single();

	if (error) return fail(400, 'Failed to update content', error);
	return ok(data);
});

export const DELETE = withUserAuth(async ({ auth, supabase, params }) => {
	const { id: site_id, name } = params;
	if (auth.role !== 'owner') throw new HttpError(403, 'Only owners can delete content');

	const { error } = await supabase
		.from('content')
		.delete()
		.eq('site_id', site_id)
		.eq('name', name)
		.eq('company_id', auth.company_id);

	if (error) return fail(400, 'Failed to delete content', error);
	return ok({ success: true });
});
