import { Hono } from 'hono';
import { z } from 'zod';

import { createUrl, getUrl } from '@/services/url';
import { errorResponse, successResponse } from '@/lib/response';
import { validator } from '@/middlewares/validator';
import { verifyToken } from '@/lib/turnstile';

const app = new Hono();

const newSchema = z.object({
  encryptedUrl: z.string(),
  identifier: z.string(),
  isPasswordProtected: z.boolean(),
  token: z.string(),
});

app.post('/new', validator('json', newSchema), async c => {
  const { encryptedUrl, identifier, isPasswordProtected, token } =
    await c.req.json();

  const tokenIsValid = await verifyToken(token);

  if (tokenIsValid) {
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
