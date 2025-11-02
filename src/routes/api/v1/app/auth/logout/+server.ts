import { json } from '@sveltejs/kit';
import { serialize } from 'cookie';

export const POST = async () => {
	const cookie = serialize('session_user', '', {
		path: '/',
		expires: new Date(0),
		httpOnly: true,
		secure: true,
		sameSite: 'lax'
	});
	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: { 'Set-Cookie': cookie, 'Content-Type': 'application/json' }
	});
};
