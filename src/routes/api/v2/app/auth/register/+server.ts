// src/routes/api/register/+server.ts
import { json } from '@sveltejs/kit';
import { getServiceClient } from '../../../../../../lib-depricated/supabase';
import { issueSiteJWT } from '../../../../../../lib-depricated/supabase';

export async function POST({ request }) {
    console.log(request)
  const { code, companyName, domain, plan } = await request.json();
  if (!code || !companyName || !domain || !plan) {
    return json({ error: 'Missing fields' }, { status: 400 });
  }

  const svc = getServiceClient();

  const { data: invite, error: inviteErr } = await svc
    .from('registration_codes')
    .select('*')
    .eq('code', code)
    .single();

  if (
    inviteErr ||
    !invite ||
    invite.used ||
    invite.uses >= invite.max_uses ||
    (invite.expires_at && new Date(invite.expires_at) < new Date())
  ) {
    return json({ error: 'Invalid or already used registration code' }, { status: 403 });
  }

  const { data: company, error: companyErr } = await svc
    .from('companies')
    .insert({
      name: companyName,
      domain,
      plan
    })
    .select('*')
    .single();

  if (companyErr) {
    return json({ error: companyErr.message }, { status: 500 });
  }

  let { data: site } = await svc
    .from('sites')
    .select('*')
    .eq('company_id', company.id)
    .eq('domain', domain)
    .single();

  if (!site) {
    const res = await svc
      .from('sites')
      .insert({
        company_id: company.id,
        // name: `${company.name} Main Site`,
        domain
      })
      .select('*')
      .single();
      console.log(res)
    site = res.data!;
  }
  console.log(site)
  const token = issueSiteJWT({
    company_id: company.id,
    site_id: site.id,
    domain: site.domain,
    permissions: ['read:content']
  });

  await svc.from('site_tokens').insert({
    site_id: site.id,
    token,
    permissions: ['read:content']
  });

  await svc
    .from('registration_codes')
    .update({
      used: true,
      used_at: new Date().toISOString(),
      uses: invite.uses + 1
    })
    .eq('id', invite.id);

  return json({
    company,
    site,
    token
  });
}
