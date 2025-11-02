import { json } from '@sveltejs/kit';
import { getServiceClient } from '$lib/supabase';

/**
 * GET /api/v1/app/companies/[id]
 */
export const GET = async ({ params }) => {
	try {
		const { id } = params;
		const svc = getServiceClient();

		const { data, error } = await svc
			.from('companies')
			.select('id, name, domain, plan, whitelabel, created_at')
			.eq('id', id)
			.single();

		if (error) throw error;
		return json({ data });
	} catch (err: any) {
		console.error('Company GET error:', err);
		return json({ error: err.message || 'Failed to fetch company' }, { status: 500 });
	}
};

/**
 * PATCH /api/v1/app/companies/[id]
 * Body: { name?, domain?, plan?, whitelabel? }
 */
export const PATCH = async ({ request, params }) => {
	try {
		const { id } = params;
		const updates = await request.json();
		if (!id) return json({ error: 'Missing company ID.' }, { status: 400 });

		const svc = getServiceClient();
		const { data, error } = await svc
			.from('companies')
			.update(updates)
			.eq('id', id)
			.select('*')
			.single();

		if (error) throw error;
		return json({ message: 'Company updated successfully', data });
	} catch (err: any) {
		console.error('Company PATCH error:', err);
		return json({ error: err.message || 'Failed to update company' }, { status: 500 });
	}
};

/**
 * DELETE /api/v1/app/companies/[id]
 */
export const DELETE = async ({ params }) => {
	try {
		const { id } = params;
		const svc = getServiceClient();

		const { error } = await svc.from('companies').delete().eq('id', id);
		if (error) throw error;

		return json({ message: 'Company deleted successfully', success: true });
	} catch (err: any) {
		console.error('Company DELETE error:', err);
		return json({ error: err.message || 'Failed to delete company' }, { status: 500 });
	}
};
