import { withUserAuth } from '$lib/server/withAuth';
import { ok, fail } from '$lib/server/http';
import { HttpError } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = withUserAuth(async ({ auth, supabase, params }) => {
	const { id } = params;
	const { data, error } = await supabase
		.from('sites')
		.select('*')
		.eq('id', id)
		.eq('company_id', auth.company_id)
		.single();

	if (error || !data) return fail(404, 'Site not found', error);
	return ok(data);
});

export const PATCH: RequestHandler = withUserAuth(async ({ auth, supabase, request, params }) => {
	const { id } = params;
	if (!['owner', 'editor'].includes(auth.role))
		throw new HttpError(403, 'Forbidden');

	const body = await request.json();
	const { data, error } = await supabase
		.from('sites')
		.update(body)
		.eq('id', id)
		.eq('company_id', auth.company_id)
		.select('*')
		.single();

	if (error) return fail(400, 'Update failed', error);
	return ok(data);
});

export const DELETE: RequestHandler = withUserAuth(async ({ auth, supabase, params }) => {
	const { id } = params;

	// Only owners can delete sites
	if (auth.role !== 'owner')
		throw new HttpError(403, 'Only the company owner can delete a site.');

	// Confirm the site belongs to the user's company
	const { data: site, error: findError } = await supabase
		.from('sites')
		.select('id')
		.eq('id', id)
		.eq('company_id', auth.company_id)
		.single();

	if (findError || !site) return fail(404, 'Site not found', findError);

	// Delete the site (and optionally related data if cascading is not set)
	const { error: deleteError } = await supabase
		.from('sites')
		.delete()
		.eq('id', id)
		.eq('company_id', auth.company_id);

	if (deleteError) return fail(400, 'Failed to delete site', deleteError);

	return ok({ message: 'Site deleted successfully.' });
});
