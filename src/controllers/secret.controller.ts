import { Hono } from 'hono';
import { z } from 'zod';

import { successResponse } from '@/lib/response';
import { validator } from '@/middlewares/validator';
import SecretModel, { type SecretDocument } from '@/models/secret.model';
import { generateSecureSlug } from '@/lib/crypto.server';

const app = new Hono();

const newSchema = z.object({
  encryptedData: z.string(),
  expiresIn: z.number(),
  isPasswordProtected: z.boolean(),
  viewLimit: z.number().or(z.null()),
});

app.post('/create', validator('json', newSchema), async c => {
  const { encryptedData, expiresIn, isPasswordProtected, viewLimit } =
    await c.req.json();

  let publicId;
  let publicIdExists = true;

  do {
    publicId = await generateSecureSlug(24);

    const secret = await SecretModel.findOne({
      publicId,
    }).lean<SecretDocument>();

    if (!secret) publicIdExists = false;
  } while (publicIdExists);

  await SecretModel.create({
    encryptedData,
    expireAt: new Date(Date.now() + expiresIn * 1000),
    isPasswordProtected,
    publicId,
    remainingViews: viewLimit,
  });

  return c.json(successResponse({ id: publicId }), 200);
});

export default app;
