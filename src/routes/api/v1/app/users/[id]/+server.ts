import { json } from '@sveltejs/kit';
import { getClientWithUserToken, getServiceClient } from '$lib/supabase';
import bcrypt from 'bcrypt';

/**
 * GET /api/v1/app/users/[id]
 */
export const GET = async ({ params, locals }) => {
	try {
		if (!locals.userJwt) return json({ error: 'Unauthorized' }, { status: 401 });
		const { id } = params;

		const supa = getClientWithUserToken(locals.userJwt);
		const { data, error } = await supa
			.from('users')
			.select('id, email, full_name, role, company_id, created_at')
			.eq('id', id)
			.single();

		if (error) throw error;
		return json({ data });
	} catch (err: any) {
		console.error('User GET error:', err);
		return json({ error: err.message || 'Failed to fetch user' }, { status: 500 });
	}
};

/**
 * PATCH /api/v1/app/users/[id]
 * Update user fields
 * Body: { full_name?, role?, password? }
 */
export const PATCH = async ({ request, params, locals }) => {
	try {
		if (!locals.userJwt) return json({ error: 'Unauthorized' }, { status: 401 });
		const { id } = params;
		const updates = await request.json();

		const svc = getServiceClient();
		if (updates.password) {
			updates.password_hash = await bcrypt.hash(updates.password, 10);
			delete updates.password;
		}

		const { data, error } = await svc
			.from('users')
			.update(updates)
			.eq('id', id)
			.select('id, email, full_name, role, company_id')
			.single();

		if (error) throw error;
		return json({ message: 'User updated successfully', data });
	} catch (err: any) {
		console.error('User PATCH error:', err);
		return json({ error: err.message || 'Failed to update user' }, { status: 500 });
	}
};

/**
 * DELETE /api/v1/app/users/[id]
 */
export const DELETE = async ({ params, locals }) => {
	try {
		if (!locals.userJwt) return json({ error: 'Unauthorized' }, { status: 401 });
		const { id } = params;

		const svc = getServiceClient();
		const { error } = await svc.from('users').delete().eq('id', id);
		if (error) throw error;

		return json({ message: 'User deleted successfully', success: true });
	} catch (err: any) {
		console.error('User DELETE error:', err);
		return json({ error: err.message || 'Failed to delete user' }, { status: 500 });
	}
};
