import { hash } from 'bcrypt';

import { supabase } from './supabase';

import { generateSecureKey, hashIdentifier } from './crypto.server';
import { DESTRUCTION_KEY_BYTES } from '@/constants/url';

export async function createUrl(
  encryptedUrl: string,
  identifier: string,
  passwordProtected: boolean = false,
) {
  const hashedIdentifier = await hashIdentifier(identifier);

  const { data } = await supabase
    .from('katana.urls')
    .select('id')
    .eq('hashed_identifier', identifier)
    .limit(1);

  if (data?.length) throw new Error('Identifier exists');

  const destructionKey = generateSecureKey(DESTRUCTION_KEY_BYTES);
  const destructionKeyHash = await hash(destructionKey, 12);

  await supabase.from('katana.urls').insert([
    {
      destruction_key: destructionKeyHash,
      encrypted_url: encryptedUrl,
      hashed_identifier: hashedIdentifier,
      password_protected: passwordProtected,
    },
  ]);

  return { destructionKey: `${identifier}:${destructionKey}` };
}

export async function getEncryptedUrl(identifier: string) {
  const hashedIdentifier = await hashIdentifier(identifier);

  const { data } = await supabase
    .from('katana.urls')
    .select('encrypted_url, password_protected')
    .eq('hashed_identifier', hashedIdentifier)
    .single();

  return data;
}
