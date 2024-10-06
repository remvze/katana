import { compare, hash } from 'bcrypt';

import { urlRepository } from '@/repositories/url.repository';

import { generateSecureKey, hashIdentifier } from '@/lib/crypto.server';
import { DESTRUCTION_KEY_BYTES } from '@/constants/url';

export async function createUrl(
  encryptedUrl: string,
  identifier: string,
  isPasswordProtected: boolean = false,
) {
  const hashedIdentifier = await hashIdentifier(identifier);

  const shortUrl = await urlRepository.getUrl(hashedIdentifier);

  if (shortUrl) throw new Error('Identifier exists');

  const destructionKey = generateSecureKey(DESTRUCTION_KEY_BYTES);
  const destructionKeyHash = await hash(destructionKey, 12);

  const url = await urlRepository.createUrl({
    destruction_key: destructionKeyHash,
    encrypted_url: encryptedUrl,
    hashed_identifier: hashedIdentifier,
    is_password_protected: isPasswordProtected,
  });

  return { destructionKey: `${url?.id}:${destructionKey}` };
}

export async function getUrl(identifier: string) {
  const hashedIdentifier = await hashIdentifier(identifier);

  const data = await urlRepository.getUrl(hashedIdentifier);

  const { clicks, id } = data;
  await urlRepository.updateUrl(id, { clicks: clicks + 1 });

  return { ...data, clicks: clicks + 1 };
}

export async function deleteUrl(destructionKey: string) {
  const [id, destructionKeyValue] = destructionKey.split(':');

  if (!id || !destructionKey) throw new Error('Invalid destruction key');

  const url = await urlRepository.getUrlById(id);

  if (!url || url.is_deleted) throw new Error("Url doesn't exists");

  const isDestructionKeyValid = await compare(
    destructionKeyValue,
    url.destruction_key,
  );

  if (!isDestructionKeyValid) throw new Error('Invalid destruction key');

  await urlRepository.deleteUrl(id);
}
