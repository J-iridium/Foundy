import { json } from '@sveltejs/kit';
import { Admin, getServiceClient } from '$lib/supabase';

/**
 * GET /api/v1/app/companies
 * For admin — list all companies
 */
export const GET = async () => {
	try {
		const svc = getServiceClient();
		const { data, error } = await svc
			.from('companies')
			.select('id, name, domain, plan, whitelabel, created_at')
			.order('created_at', { ascending: false });

		if (error) throw error;
		return json({ data });
	} catch (err: any) {
		console.error('Companies GET error:', err);
		return json({ error: err.message || 'Failed to list companies' }, { status: 500 });
	}
};

/**
 * POST /api/v1/app/companies
 * Body: { name, domain, plan, whitelabel }
 */
export const POST = async ({ request }) => {
	try {
		const { name, domain, plan, whitelabel } = await request.json();
		if (!name || !domain)
			return json({ error: 'Company name and domain are required.' }, { status: 400 });

		const { data, error } = await Admin.createCompanyWithDefaultSite({
			name,
			domain,
			plan: plan || 'starter',
			whitelabel: !!whitelabel
		});

		if (error) throw new Error(error.message);

		return json({
			message: 'Company created successfully',
			company: data.company,
			site: data.site,
			token: data.token
		}, { status: 201 });
	} catch (err: any) {
		console.error('Company POST error:', err);
		return json({ error: err.message || 'Failed to create company' }, { status: 500 });
	}
};
