import { compare, hash } from 'bcrypt';

import { urlRepository } from '@/repositories/url.repository';

import {
  generateSecureKey,
  generateSecureSlug,
  sha256,
} from '@/lib/crypto.server';
import { DESTRUCTION_KEY_BYTES, SLUG_LENGTH } from '@/constants/url';

export async function createUrl(
  encryptedUrl: string,
  isPasswordProtected: boolean = false,
) {
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

  await urlRepository.createUrl({
    destruction_key: destructionKeyHash,
    encrypted_url: encryptedUrl,
    hashed_slug: hashedSlug,
    is_password_protected: isPasswordProtected,
  });

  return { destructionKey: `${slug}:${destructionKey}`, slug };
}

export async function getUrl(slug: string) {
  const hashedSlug = sha256(slug);

  const data = await urlRepository.getUrl(hashedSlug);

  if (data === null) return data;

  const { _id, clicks } = data;
  await urlRepository.updateUrl(_id, { clicks: clicks + 1 });

  return { ...data, clicks: clicks + 1 };
}

export async function deleteUrl(destructionKey: string) {
  const [slug, destructionKeyValue] = destructionKey.split(':');

  if (!slug || !destructionKey) throw new Error('Invalid destruction key');

  const hashedSlug = sha256(slug);
  const url = await urlRepository.getUrl(hashedSlug);

  if (!url || url.is_deleted) throw new Error("Url doesn't exists");

  const isDestructionKeyValid = await compare(
    destructionKeyValue,
    url.destruction_key,
  );

  if (!isDestructionKeyValid) throw new Error('Invalid destruction key');

  await urlRepository.deleteUrl(url._id);
}
