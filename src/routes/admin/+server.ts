import { json } from '@sveltejs/kit';
import { Admin, getServiceClient } from '$lib/supabase';

/**
 * POST /api/test-company
 * Body: { company: { name, domain, plan, whitelabel }, user: { email, full_name, role } }
 */
export const POST = async ({ request }) => {
	try {
		const { company, user } = await request.json();

		// Basic validation
		if (!company?.name || !company?.domain || !user?.email) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		// 1️⃣ Create company + default site + token
		const { data, error: adminErr } = await Admin.createCompanyWithDefaultSite(company);
		if (adminErr) throw new Error(adminErr.message);

		// 2️⃣ Create the user under the company
		const svc = getServiceClient();
		const { data: newUser, error: userErr } = await svc
			.from('users')
			.insert({
				email: user.email,
				full_name: user.full_name,
				role: user.role,
				company_id: data.company.id
			})
			.select('*')
			.single();

		if (userErr) throw new Error(userErr.message);

		// 3️⃣ Return everything
		return json({
			company: data.company,
			site: data.site,
			token: data.token,
			user: newUser
		});
	} catch (err: any) {
		console.error('Error in /api/test-company:', err);
		return json({ error: err.message || 'Internal server error' }, { status: 500 });
	}
};
