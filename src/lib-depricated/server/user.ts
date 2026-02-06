// src/lib/server/user.ts
import { browser } from '$app/environment';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import type { RequestEvent } from '@sveltejs/kit';
import type { SessionUser } from '$types/tokens/index'

/**
 * Require an authenticated user (server-only)
 * Throws a 401 if not logged in.
 */
export function requireUser(event: RequestEvent): SessionUser {
	const user = event.locals.user;
	if (!user) throw new Response('Unauthorized', { status: 401 });
	return user;
}

/**
 * Get the current user.
 * - On server: from event.locals
 * - On frontend: from page.data.user (if exposed via layout)
 */
export function getUser(event?: RequestEvent): SessionUser | null {
	if (browser) {
		return get(page).data.user ?? null;
	}

	return event?.locals.user ?? null;
}
