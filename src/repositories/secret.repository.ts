import { dbConnect } from '@/database/mongo';
import { normalizeId } from '@/lib/normalizer';

import type { SecretDocument } from '@/models/secret.model';
import SecretModel from '@/models/secret.model';

class SecretRepository {
  async getSecretByPublicId(publicId: string) {
    await dbConnect();

    const document = await SecretModel.findOne({
      publicId,
    }).lean<SecretDocument>();

    return document ? normalizeId(document) : null;
  }
}

export const secretRepository = new SecretRepository();
