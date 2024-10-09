import { compare, hash } from 'bcrypt';

import { urlRepository } from '@/repositories/url.repository';
import { UrlEntity } from '@/entities/url.entity';

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

  const urlEntity = new UrlEntity({
    destructionKey: destructionKeyHash,
    encryptedUrl: encryptedUrl,
    hashedSlug: hashedSlug,
    isPasswordProtected: isPasswordProtected,
  });

  await urlRepository.createUrl(urlEntity);

  return { destructionKey: `${slug}:${destructionKey}`, slug };
}

export async function getUrl(slug: string) {
  const hashedSlug = sha256(slug);
  const entity = await urlRepository.getUrl(hashedSlug);

  if (entity && entity.isActive()) {
    entity.incrementClick();

    await urlRepository.updateUrl(entity.id, entity);

    return entity;
  }

  return null;
}

export async function deleteUrl(destructionKey: string) {
  const [slug, destructionKeyValue] = destructionKey.split(':');

  if (!slug || !destructionKey) throw new Error('Invalid destruction key');

  const hashedSlug = sha256(slug);
  const entity = await urlRepository.getUrl(hashedSlug);

  if (!entity || !entity.isActive()) throw new Error("Url doesn't exists");

  const isDestructionKeyValid = await compare(
    destructionKeyValue,
    entity.destructionKey,
  );

  if (!isDestructionKeyValid) throw new Error('Invalid destruction key');

  await urlRepository.deleteUrl(entity.id);
}
