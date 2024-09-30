import type { APIRoute } from 'astro';

import { createUrl } from '@/lib/url';

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get('Content-Type') !== 'application/json')
    return new Response(null, { status: 400 });

  const { url } = await request.json();

  const slug = await createUrl(url);

  return new Response(JSON.stringify({ slug }), { status: 200 });
};
