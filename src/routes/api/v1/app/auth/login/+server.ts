import { json } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { getServiceClient, issueUserJWT } from '$lib/supabase';
import { serialize } from 'cookie';

export const POST = async ({ request }) => {
	try {
		const { email, password } = await request.json();
		if (!email || !password)
			return json({ error: 'Email and password are required.' }, { status: 400 });

		const svc = getServiceClient();

		const { data: user, error } = await svc
			.from('users')
			.select('id, email, full_name, role, company_id')
			.eq('email', email)
			.single();

		if (error || !user) {
			return json({ error: 'Invalid email or password.' }, { status: 401 });
		}

        // TODO: Enable encryption when fixed
		// const valid = await bcrypt.compare(password, user.password_hash);
		// if (!valid) return json({ error: 'Invalid email or password.' }, { status: 401 });

		const jwt = issueUserJWT({
			user_id: user.id,
			company_id: user.company_id,
			role: user.role
		});

		// Store in secure cookie
		const cookie = serialize('session_user', jwt, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});

		return new Response(JSON.stringify({
			user: {
				id: user.id,
				email: user.email,
				full_name: user.full_name,
				role: user.role,
				company_id: user.company_id,
				token: jwt
			}
		}), {
			status: 200,
			headers: { 'Set-Cookie': cookie, 'Content-Type': 'application/json' }
		});
	} catch (err: any) {
		console.error('Login error:', err);
		return json({ error: err.message || 'Internal server error' }, { status: 500 });
	}
};
