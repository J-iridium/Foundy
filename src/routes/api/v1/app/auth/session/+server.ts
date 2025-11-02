import { json } from '@sveltejs/kit';

export const GET = async ({ cookies }) => {
	try {
		const session = cookies.get('session_user');
		if (!session) return json({ user: null });

		const user = JSON.parse(session);
		return json({ user });
	} catch {
		return json({ user: null });
	}
};
