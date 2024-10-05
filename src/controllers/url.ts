import { Hono } from 'hono';

import { createUrl, getUrl } from '@/services/url';
import { errorResponse, successResponse } from '@/lib/response';

const app = new Hono();

app.post('/new', async c => {
  if (c.req.header('Content-Type') !== 'application/json') {
    return c.json(errorResponse('Invalid content type'), 400);
  }

  const { encryptedUrl, identifier, isPasswordProtected, token } =
    await c.req.json();

  if (!token) {
    return c.json(errorResponse('No turnstile token found.'), 400);
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
    const { destructionKey } = await createUrl(
      encryptedUrl,
      identifier,
      !!isPasswordProtected || false,
    );

    return c.json(successResponse({ destructionKey }), 200);
  } else {
    return c.json(errorResponse('Verification failed.'), 400);
  }
});

app.get('/:identifier', async c => {
  const identifier = c.req.param('identifier');

  const data = await getUrl(identifier!);

  if (data) {
    return c.json(
      successResponse({
        encryptedUrl: data.encrypted_url,
        isPasswordProtected: data.is_password_protected,
      }),
      200,
    );
  }

  return c.json(errorResponse('Not found'), 404);
});

export default app;
