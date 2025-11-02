// src/lib/server/http.ts
import { json } from '@sveltejs/kit';
import type { HttpError } from './auth';

export const ok = <T>(data: T, status = 200) => json({ data, error: null }, { status });
export const fail = (status: number, message: string, details?: unknown) =>
  json({ data: null, error: { message, details } }, { status });

export function errorToResponse(err: unknown) {
  const e = err as any;
  if (e?.status && e?.message) return fail(e.status, e.message, e.details);
  return fail(500, 'Internal Server Error', e?.message ?? e);
}
