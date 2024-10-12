import { Hono } from 'hono';
import { z } from 'zod';

import { dbConnect } from '@/database/mongo';
import { errorResponse, successResponse } from '@/lib/response';
import { validator } from '@/middlewares/validator';
import SecretModel, { type SecretDocument } from '@/models/secret.model';
import { generateSecureSlug, sha256 } from '@/lib/crypto.server';
import { MAX_ENCRYPTED_FILE_SIZE } from '@/constants/file';
import { secretExpirations } from '@/lib/expiration';

const app = new Hono();

const newSchema = z.object({
  encryptedFile: z.string().or(z.null()),
  encryptedNote: z.string(),
  expiresIn: z.number(),
  isPasswordProtected: z.boolean(),
  viewLimit: z.number().or(z.null()),
});

app.post('/create', validator('json', newSchema), async c => {
  await dbConnect();

  const {
    encryptedFile,
    encryptedNote,
    expiresIn,
    isPasswordProtected,
    viewLimit,
  } = await c.req.json();

  const isExpirationValid = secretExpirations.find(
    item => item.value === expiresIn,
  );

  if (!isExpirationValid)
    return c.json(errorResponse('Expiration date is not valid.'), 400);

  let publicId;
  let hashedPublicId;
  let publicIdExists = true;

  do {
    publicId = await generateSecureSlug(24);
    hashedPublicId = sha256(publicId);

    const secret = await SecretModel.findOne({
      hashedPublicId,
    }).lean<SecretDocument>();

    if (!secret) publicIdExists = false;
  } while (publicIdExists);

  if (encryptedFile) {
    const encryptedFileSize = Buffer.byteLength(encryptedFile, 'utf-8');

    if (encryptedFileSize > MAX_ENCRYPTED_FILE_SIZE) {
      return c.json(errorResponse('The file is too big'), 400);
    }
  }

  await SecretModel.create({
    encryptedFile,
    encryptedNote,
    expiresAt: new Date(Date.now() + expiresIn * 1000),
    hashedPublicId,
    isPasswordProtected,
    remainingViews: viewLimit,
  });

  return c.json(successResponse({ publicId }), 200);
});

app.get('/:id/content', async c => {
  await dbConnect();

  const id = c.req.param('id');
  const hashedPublicId = sha256(id);

  const secret = await SecretModel.findOne({
    hashedPublicId,
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
        encryptedNote: secret.encryptedNote,
      }),
      200,
    );
  }

  return c.json(
    successResponse({
      encryptedFile: secret.encryptedFile,
      encryptedNote: secret.encryptedNote,
    }),
    200,
  );
});

export default app;
