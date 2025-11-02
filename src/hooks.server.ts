// src/hooks.server.ts
import jwt from 'jsonwebtoken';
import { SUPABASE_JWT_SECRET } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session_user');
	if (token) {
		try {
			const user = jwt.verify(token, SUPABASE_JWT_SECRET);
			event.locals.user = user; 
		} catch {
			event.locals.user = null;
			event.cookies.delete('user', { path: '/' }); 
		}
	} else {
		event.locals.user = null;
	}

	return await resolve(event);
};
