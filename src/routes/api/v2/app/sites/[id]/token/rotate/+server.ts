import { withUserAuth } from '$lib/server/withAuth';
import { ok, fail } from '$lib/server/http';
import { HttpError } from '$lib/server/auth';
import jwt from 'jsonwebtoken';
import { SUPABASE_JWT_SECRET } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = withUserAuth(async ({ auth, supabase, params }) => {
	const { id: site_id } = params;

	if (auth.role !== 'owner')
		throw new HttpError(403, 'Only the owner can rotate tokens.');

	// Fetch latest site info
	const { data: site, error: siteError } = await supabase
		.from('sites')
		.select('id, domain, company_id')
		.eq('id', site_id)
		.eq('company_id', auth.companyId)
		.single();

	if (siteError || !site) return fail(404, 'Site not found', siteError);

	// Generate new JWT
	const token = jwt.sign(
		{
			siteId: site.id,
			domain: site.domain,
			permissions: ['read:content']
		},
		SUPABASE_JWT_SECRET!,
		{ expiresIn: '365d' }
	);

	// Upsert into site_tokens table
	const { data: updated, error: updateError } = await supabase
		.from('site_tokens')
		.upsert(
			{
				site_id: site.id,
				token: token,
				created_at: new Date().toISOString()
			},
			{ onConflict: 'site_id' }
		)
		.select()
		.single();
		console.log(updateError)
	if (updateError) return fail(400, 'Failed to store new token', updateError);

	return ok({
		token,
		rotated: true,
		site_id: site.id,
		domain: site.domain,
	});
});
