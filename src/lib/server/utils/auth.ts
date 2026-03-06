// =============================================================================
// server/utils/auth.ts
// =============================================================================
// Shared helpers used by all auth API routes.
// Import handleAuthError into every auth +server.ts.
// Import requireSession into every guarded route.
// =============================================================================

import { json }              from '@sveltejs/kit';
import type { Cookies }      from '@sveltejs/kit';
import { AuthError }         from '../services/auth/AuthService';
import { bus }               from '../framework/services/bus/BusService';
import type { TokenService } from '../services/auth/TokenService';
import type { AuthService }  from '../services/auth/AuthService';
import type { SessionPayload } from '../services/auth/TokenService';

// ── handleAuthError ───────────────────────────────────────────────────────────
// Converts any error from AuthService into a consistent JSON response.
// AuthError    → uses err.code + err.status
// Unknown err  → 500, never leaks internals to client

export function handleAuthError(err: unknown): Response {
  if (err instanceof AuthError) {
    return json(
      { ok: false, code: err.code, message: err.message },
      { status: err.status }
    );
  }
  console.error('[auth] Unexpected error:', err);
  return json(
    { ok: false, code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' },
    { status: 500 }
  );
}

// ── requireSession ────────────────────────────────────────────────────────────
// Guards any +page.server.ts or +server.ts that requires a logged-in user.
// Verifies the cookie token AND checks the session still exists in the DB.
// Throws a 401 Response if anything is missing or invalid.
//
// Usage in a guarded route:
//   const session = await requireSession(cookies);
//   // session.sub  → user_id
//   // session.oid  → active org_id
//   // session.role → role in active org
//   // session.email → user email

export async function requireSession(cookies: Cookies): Promise<SessionPayload> {
  const token = bus.get<TokenService>('token');
  const raw   = cookies.get(token.cookieName());

  if (!raw) {
    throw json(
      { ok: false, code: 'AUTH_REQUIRED', message: 'You must be logged in.' },
      { status: 401 }
    );
  }

  try {
    const auth = bus.get<AuthService>('auth');
    return await auth.getSession(raw);
  } catch {
    cookies.delete(token.cookieName(), { path: '/' });
    throw json(
      { ok: false, code: 'AUTH_SESSION_INVALID', message: 'Session expired. Please log in again.' },
      { status: 401 }
    );
  }
}