import { compare, hash } from 'bcrypt';

import { urlRepository } from '@/repositories/url.repository';

import {
  generateSecureKey,
  generateSecureSlug,
  sha256,
} from '@/lib/crypto.server';
import { DESTRUCTION_KEY_BYTES, SLUG_LENGTH } from '@/constants/url';

async function generateUniqueSlug() {
  let slug: string;
  let hashedSlug: string;
  let slugExists = true;

  do {
    slug = await generateSecureSlug(SLUG_LENGTH);
    hashedSlug = sha256(slug);

    const shortUrl = await urlRepository.getUrl(hashedSlug);
    slugExists = !!shortUrl;
  } while (slugExists);

  return { hashedSlug, slug };
}

export async function createUrl(
  encryptedUrl: string,
  isPasswordProtected: boolean,
  expireAfter: number,
) {
  const { hashedSlug, slug } = await generateUniqueSlug();

  const destructionKey = generateSecureKey(DESTRUCTION_KEY_BYTES);
  const destructionKeyHash = await hash(destructionKey, 12);

  await urlRepository.createUrl({
    destructionKey: destructionKeyHash,
    encryptedUrl,
    expiresAfter: expireAfter || null,
    expiresAt: expireAfter ? new Date(Date.now() + expireAfter * 1000) : null,
    hashedSlug,
    isPasswordProtected,
  });

  return { destructionKey: `${slug}:${destructionKey}`, slug };
}

export async function getUrl(slug: string) {
  const hashedSlug = sha256(slug);
  const url = await urlRepository.getUrl(hashedSlug);

  if (url) {
    await urlRepository.updateUrl(hashedSlug, {
      clicks: url.clicks + 1,
    });

    return { ...url, clicks: url.clicks + 1 };
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
