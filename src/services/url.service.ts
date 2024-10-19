import { compare, hash } from 'bcrypt';

import { urlRepository } from '@/repositories/url.repository';

import {
  generateSecureKey,
  generateSecureSlug,
  sha256,
} from '@/lib/crypto.server';
import { DESTRUCTION_KEY_BYTES, SLUG_LENGTH } from '@/constants/url';
import { UrlModel } from '@/models/url.model';

export async function createUrl(
  encryptedUrl: string,
  isPasswordProtected: boolean,
  expireAfter: number,
) {
  console.log('service', { isPasswordProtected });

  let slug;
  let slugExists = true;

  do {
    slug = await generateSecureSlug(SLUG_LENGTH);
    const hashedSlug = sha256(slug);

    const shortUrl = await urlRepository.getUrl(hashedSlug);

    if (!shortUrl) slugExists = false;
  } while (slugExists);

  const hashedSlug = sha256(slug);

  const destructionKey = generateSecureKey(DESTRUCTION_KEY_BYTES);
  const destructionKeyHash = await hash(destructionKey, 12);

  await urlRepository.createUrl(
    new UrlModel(
      hashedSlug,
      encryptedUrl,
      destructionKeyHash,
      isPasswordProtected,
      0,
      Date.now(),
      expireAfter ? expireAfter : null,
    ),
  );

  return { destructionKey: `${slug}:${destructionKey}`, slug };
}

export async function getUrl(slug: string) {
  const hashedSlug = sha256(slug);
  const url = await urlRepository.getUrl(hashedSlug);

  if (url) {
    const updatedUrl = await urlRepository.updateUrl(hashedSlug, {
      clicks: url.clicks + 1,
    });

    return updatedUrl;
  }

  return null;
}

export async function deleteUrl(destructionKey: string) {
  const [slug, destructionKeyValue] = destructionKey.split(':');

  if (!slug || !destructionKey) throw new Error('Invalid destruction key');

  const hashedSlug = sha256(slug);
  const url = await urlRepository.getUrl(hashedSlug);

  if (!url) throw new Error("Url doesn't exists");

  const isDestructionKeyValid = await compare(
    destructionKeyValue,
    url.destructionKey,
  );

  if (!isDestructionKeyValid) throw new Error('Invalid destruction key');

  await urlRepository.deleteUrl(hashedSlug);
}
