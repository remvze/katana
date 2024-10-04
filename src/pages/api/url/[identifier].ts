import type { APIRoute } from 'astro';

import { getEncryptedUrl } from '@/lib/url';

export const GET: APIRoute = async ({ params }) => {
  const { identifier } = params;

  const data = await getEncryptedUrl(identifier!);

  if (data) {
    return new Response(
      JSON.stringify({
        encryptedUrl: data.encrypted_url,
        passwordProtected: data.password_protected,
      }),
      {
        status: 200,
      },
    );
  }

  return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
};
