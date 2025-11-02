import { redirect } from '@sveltejs/kit';

export const load = async ({ fetch }) => {
	await fetch('/api/v2/app/auth/logout', { method: 'POST' });
	throw redirect(303, '/login');
};
