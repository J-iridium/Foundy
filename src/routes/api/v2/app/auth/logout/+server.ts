// src/routes/api/v2/app/auth/logout/+server.ts
import { serialize } from 'cookie';

export const POST = async ({ cookies }) => {
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
