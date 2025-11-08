// src/routes/api/v2/app/auth/login/+server.ts
//@ts-ignore
import jwt from 'jsonwebtoken';
import { SUPABASE_JWT_SECRET } from '$env/static/private';
import { getServiceClient } from '$lib/supabase';
import { ok, fail } from '$lib/server/http';
import { serialize } from 'cookie';
import type { SessionUser } from '$types/tokens/SessionUser.type.js';
// import bcrypt from 'bcrypt';

export const POST = async ({ request }) => {
  const { email, password } = await request.json();
  if (!email || !password) return fail(400, 'Missing credentials');

  const supabase = getServiceClient();
  const { data: user, error } = await supabase
    .from('users')
    .select('id, company_id, role, password, full_name')
    .eq('email', email)
    .single();

  if (error || !user || user.password !== password)
    return fail(401, 'Invalid credentials');

  const sessionUserData : SessionUser = {
    userId : user.id,
    userName : user.full_name,
    companyId : user.company_id,
    role : user.role
  }

  const token = jwt.sign(
    sessionUserData,
    SUPABASE_JWT_SECRET!,
    { expiresIn: '7d' }
  );

  const cookie = serialize('session_user', token, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });

  return new Response(JSON.stringify({
    jwt: token
  }), {
    status: 200,
    headers: { 'Set-Cookie': cookie, 'Content-Type': 'application/json' }
  });
};
