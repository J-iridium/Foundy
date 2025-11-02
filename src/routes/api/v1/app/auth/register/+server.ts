import { json } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { getServiceClient } from '$lib/supabase';

const SALT_ROUNDS = 10;

export const POST = async ({ request }) => {
	try {
		const { email, full_name, password, company_id, role } = await request.json();

		if (!email || !password) {
			return json({ error: 'Email and password are required.' }, { status: 400 });
		}

		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

		const svc = getServiceClient();
		const { data, error } = await svc
			.from('users')
			.insert({
				email,
				full_name,
				role: role || 'editor',
				company_id,
				password_hash: hashedPassword
			})
			.select('id, email, full_name, role, company_id')
			.single();

		if (error) throw error;
		return json({ user: data });
	} catch (err: any) {
		console.error('Register error:', err);
		return json({ error: err.message || 'Internal server error' }, { status: 500 });
	}
};
