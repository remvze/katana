import type { APIRoute } from 'astro';

import { getUrl } from '@/services/url';

export const GET: APIRoute = async ({ params }) => {
  const { identifier } = params;

  const data = await getUrl(identifier!);

  if (data) {
    return new Response(
      JSON.stringify({
        encryptedUrl: data.encrypted_url,
        isPasswordProtected: data.is_password_protected,
      }),
      {
        status: 200,
      },
    );
  }

  return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
};
