import { json } from '@sveltejs/kit';
import { getClientWithUserToken, getServiceClient } from '$lib/supabase';
import bcrypt from 'bcrypt';

/**
 * GET /api/v1/app/users
 * List all users in the current company (RLS handles company scoping)
 */
export const GET = async ({ locals }) => {
	try {
		if (!locals.userJwt) return json({ error: 'Unauthorized' }, { status: 401 });

		const supa = getClientWithUserToken(locals.userJwt);
		const { data, error } = await supa
			.from('users')
			.select('id, email, full_name, role, company_id, created_at')
			.order('created_at', { ascending: true });

		if (error) throw error;
		return json({ data });
	} catch (err: any) {
		console.error('Users GET error:', err);
		return json({ error: err.message || 'Failed to fetch users' }, { status: 500 });
	}
};

/**
 * POST /api/v1/app/users
 * Add new user to the company
 * Body: { email, full_name, password, role }
 */
export const POST = async ({ request, locals }) => {
	try {
		if (!locals.userJwt) return json({ error: 'Unauthorized' }, { status: 401 });

		const { email, full_name, password, role } = await request.json();
		if (!email || !password)
			return json({ error: 'Email and password are required.' }, { status: 400 });

		const hashedPassword = await bcrypt.hash(password, 10);

		// Use service key to insert (admins only)
		const svc = getServiceClient();
		const { data, error } = await svc
			.from('users')
			.insert({
				email,
				full_name,
				role: role || 'editor',
				password_hash: hashedPassword,
				company_id: locals.user?.company_id
			})
			.select('id, email, full_name, role, company_id')
			.single();

		if (error) throw error;
		return json({ message: 'User created successfully', data }, { status: 201 });
	} catch (err: any) {
		console.error('Users POST error:', err);
		return json({ error: err.message || 'Failed to create user' }, { status: 500 });
	}
};
