import { Hono } from 'hono';
import { z } from 'zod';

import { dbConnect } from '@/database/mongo';
import { errorResponse, successResponse } from '@/lib/response';
import { validator } from '@/middlewares/validator';
import SecretModel, { type SecretDocument } from '@/models/secret.model';
import { generateSecureSlug } from '@/lib/crypto.server';

const app = new Hono();

const newSchema = z.object({
  encryptedData: z.string(),
  encryptedFile: z.string().or(z.null()),
  expiresIn: z.number(),
  isPasswordProtected: z.boolean(),
  viewLimit: z.number().or(z.null()),
});

app.post('/create', validator('json', newSchema), async c => {
  await dbConnect();

  const {
    encryptedData,
    encryptedFile,
    expiresIn,
    isPasswordProtected,
    viewLimit,
  } = await c.req.json();

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
    encryptedFile,
    expireAt: new Date(Date.now() + expiresIn * 1000),
    isPasswordProtected,
    publicId,
    remainingViews: viewLimit,
  });

  return c.json(successResponse({ id: publicId }), 200);
});

app.get('/:id/content', async c => {
  await dbConnect();

  const id = c.req.param('id');

  const secret = await SecretModel.findOne({
    publicId: id,
  });

  if (!secret) return c.json(errorResponse('Secret does not exist'), 404);

  if (secret.remainingViews !== null) {
    secret.remainingViews -= 1;

    if (secret.remainingViews <= 0) {
      await secret.deleteOne();
    } else {
      await secret.save();
    }

    return c.json(
      successResponse({
        encryptedFile: secret.encryptedFile,
        encryptedSecret: secret.encryptedData,
      }),
      200,
    );
  }

  return c.json(
    successResponse({
      encryptedFile: secret.encryptedFile,
      encryptedSecret: secret.encryptedData,
    }),
    200,
  );
});

export default app;
