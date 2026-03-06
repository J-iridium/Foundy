import type { Handle } from '@sveltejs/kit';
import { bootstrap } from '$lib/server/framework/Bootstrap';

let booted : boolean = false;

/**
 * Global request handler.
 * Decodes the user's JWT from cookies and attaches it to `event.locals.user`.
 * If invalid or missing, clears the session.
*/
export const handle: Handle = async ({ event, resolve }) => {
	if (!booted) {
		await bootstrap();
		booted = true;
	}
	
	return resolve(event);
};
