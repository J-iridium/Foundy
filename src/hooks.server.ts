//@ts-ignore
import jwt from 'jsonwebtoken';
import { SUPABASE_JWT_SECRET } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';
import type { Role } from './types/db';

/**
 * Global request handler.
 * Decodes the user's JWT from cookies and attaches it to `event.locals.user`.
 * If invalid or missing, clears the session.
 */
export const handle: Handle = async ({ event, resolve }) => {
	const cookieName = 'session_user';
	const token = event.cookies.get(cookieName);

	if (!token) {
		event.locals.user = null;
		return resolve(event);
	}

	try {
		const user = jwt.verify(token, SUPABASE_JWT_SECRET) as { userId : string, companyId : string, userRole : Role };
		event.locals.user = user;
	} catch (error) {
		event.locals.user = null;
		event.cookies.delete(cookieName, { path: '/' });
	}

	return resolve(event);
};
