import { json } from '@sveltejs/kit';
import { getClientWithUserToken, issueSiteJWT, getServiceClient } from '$lib/supabase';

/**
 * POST /api/v1/app/sites/[id]/token/rotate
 * Rotates a site's public API token
 */
export const POST = async ({ params, locals }) => {
	try {
		if (!locals.userJwt) return json({ error: 'Unauthorized' }, { status: 401 });

		const { id } = params;

		// Get site info (company_id, domain)
		const supa = getClientWithUserToken(locals.userJwt);
		const { data: site, error: siteErr } = await supa
			.from('sites')
			.select('id, company_id, domain')
			.eq('id', id)
			.single();

		if (siteErr || !site) throw new Error(siteErr?.message || 'Site not found');

		// Generate new JWT for this site
		const newToken = issueSiteJWT({
			company_id: site.company_id,
			site_id: site.id,
			domain: site.domain,
			permissions: ['read:content']
		});

		// Use service role client to update token record
		const svc = getServiceClient();
		const { data: existing } = await svc
			.from('site_tokens')
			.select('id')
			.eq('site_id', site.id)
			.single();

		if (existing) {
			await svc
				.from('site_tokens')
				.update({ token: newToken, revoked: false, last_used_at: null })
				.eq('site_id', site.id);
		} else {
			await svc.from('site_tokens').insert({
				site_id: site.id,
				token: newToken,
				permissions: ['read:content']
			});
		}

		return json({
			message: 'Token rotated successfully',
			token: newToken
		});
	} catch (err: any) {
		console.error('Token rotation error:', err);
		return json({ error: err.message || 'Failed to rotate token' }, { status: 500 });
	}
};
