import { hash } from 'bcrypt';

import { supabase } from './supabase';

import { generateSecureKey } from './crypto.server';
import { DESTRUCTION_KEY_BYTES } from '@/constants/url';

export async function createUrl(
  encryptedUrl: string,
  identifier: string,
  passwordProtected: boolean = false,
) {
  const { data } = await supabase
    .from('katana.urls')
    .select('id')
    .eq('identifier', identifier)
    .limit(1);

  if (data?.length) throw new Error('Identifier exists');

  const destructionKey = generateSecureKey(DESTRUCTION_KEY_BYTES);
  const destructionKeyHash = await hash(destructionKey, 12);

  await supabase.from('katana.urls').insert([
    {
      destruction_key: destructionKeyHash,
      encrypted_url: encryptedUrl,
      identifier,
      password_protected: passwordProtected,
    },
  ]);

  return { destructionKey: `${identifier}:${destructionKey}` };
}

export async function getEncryptedUrl(identifier: string) {
  const { data } = await supabase
    .from('katana.urls')
    .select('encrypted_url, password_protected')
    .eq('identifier', identifier)
    .single();

  return data;
}
