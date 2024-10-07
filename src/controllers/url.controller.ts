import { Hono } from 'hono';
import { z } from 'zod';

import { createUrl, getUrl, deleteUrl } from '@/services/url.service';
import { errorResponse, successResponse } from '@/lib/response';
import { validator } from '@/middlewares/validator';
import { verifyToken } from '@/lib/turnstile';

const app = new Hono();

const newSchema = z.object({
  encryptedUrl: z.string(),
  isPasswordProtected: z.boolean(),
  token: z.string(),
});

app.post('/new', validator('json', newSchema), async c => {
  const { encryptedUrl, isPasswordProtected, token } = await c.req.json();

  const tokenIsValid = await verifyToken(token);

  if (tokenIsValid) {
    const { destructionKey, slug } = await createUrl(
      encryptedUrl,
      !!isPasswordProtected || false,
    );

    return c.json(successResponse({ destructionKey, slug }), 200);
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
        clicks: data.clicks,
        encryptedUrl: data.encrypted_url,
        isPasswordProtected: data.is_password_protected,
      }),
      200,
    );
  }

  return c.json(errorResponse('Not found'), 404);
});

const deleteSchema = z.object({
  destructionKey: z.string(),
  token: z.string(),
});

app.post('/delete', validator('json', deleteSchema), async c => {
  const { destructionKey, token } = await c.req.json();

  const tokenIsValid = await verifyToken(token);

  if (tokenIsValid) {
    try {
      await deleteUrl(destructionKey);

      return c.json(successResponse(null), 200);
    } catch (error) {
      if (error instanceof Error)
        return c.json(errorResponse(error.message), 400);

      return c.json(errorResponse('Something went wrong.'), 400);
    }
  } else {
    return c.json(errorResponse('Token is not valid'), 400);
  }
});

export default app;
