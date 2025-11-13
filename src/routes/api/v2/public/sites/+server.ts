import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { ok, fail } from '$lib/server/http';

// Server-side Supabase client (service role)
const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export const GET: RequestHandler = async ({ url }) => {
	try {
		const site_id = url.searchParams.get('site_id');
		if (!site_id) {
			return json({ success: false, error: 'Missing site_id' }, { status: 400 });
		}

		// // 1️⃣ Fetch site info
		// const { data: site, error: siteError } = await supabase
		// 	.from('sites')
		// 	.select('id, name, domain, created_at')
		// 	.eq('id', site_id)
		// 	.single();

		// if (siteError || !site) {
		// 	return json({ success: false, error: 'Site not found' }, { status: 404 });
		// }

		// 2️⃣ Fetch token from site_tokens
		const { data: tokenRecord, error: tokenError } = await supabase
			.from('site_tokens')
			.select('token')
			.eq('site_id', site_id)
			.single();

		if (tokenError || !tokenRecord) {
			return fail(400, 'Failed to fetch site content');
		}

		// 3️⃣ Return site info + token
		return ok(
		 tokenRecord.token
		);
	} catch (err: any) {
		console.error('Error in /api/v2/public/site:', err);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};
