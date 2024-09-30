import type { APIRoute } from 'astro';

import { createUrl } from '@/lib/url';

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get('Content-Type') !== 'application/json')
    return new Response(null, { status: 400 });

  const { token, url } = await request.json();

  if (!token) {
    return new Response(
      JSON.stringify({ error: 'No turnstile token found.' }),
      { status: 400 },
    );
  }

  const verificationUrl =
    'https://challenges.cloudflare.com/turnstile/v0/siteverify';

  const body = new URLSearchParams();

  body.append('secret', import.meta.env.TURNSTILE_SECRET_KEY);
  body.append('response', token);

  const verificationResponse = await fetch(verificationUrl, {
    body,
    method: 'POST',
  });

  const verificationResult = await verificationResponse.json();

  if (verificationResult.success) {
    const slug = await createUrl(url);

    return new Response(JSON.stringify({ slug }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ error: 'Verification failed.' }), {
      status: 400,
    });
  }
};
