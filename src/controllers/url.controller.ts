import { Hono } from 'hono';
import { z } from 'zod';

import { createUrl, deleteUrl } from '@/services/url.service';
// import {
//   incrementCreatedLinks,
//   incrementDeletedLinks,
// } from '@/services/statistic.service';
import { errorResponse, successResponse } from '@/lib/response';
import { validator } from '@/middlewares/validator';
import { verifyToken } from '@/lib/turnstile';
import { expirations } from '@/lib/expiration';

const app = new Hono();

const newSchema = z.object({
  encryptedUrl: z.string(),
  expireAfter: z.number(),
  isPasswordProtected: z.boolean(),
  token: z.string(),
});

app.post('/new', validator('json', newSchema), async c => {
  const { encryptedUrl, expireAfter, isPasswordProtected, token } =
    await c.req.json();

  console.log('Hello One');
  const isExpirationValid = expirations.find(
    item => item.value === expireAfter,
  );

  if (!isExpirationValid)
    return c.json(errorResponse('Expiration date is not valid.'), 400);

  const tokenIsValid = await verifyToken(token);
  console.log('Hello Two');

  if (tokenIsValid) {
    console.log('Hello Three');
    const { destructionKey, slug } = await createUrl(
      encryptedUrl,
      !!isPasswordProtected || false,
      expireAfter,
    );

    console.log('Hello Four');

    // await incrementCreatedLinks();

    return c.json(successResponse({ destructionKey, slug }), 200);
  } else {
    return c.json(errorResponse('Verification failed.'), 400);
  }
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
      // await incrementDeletedLinks();

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
