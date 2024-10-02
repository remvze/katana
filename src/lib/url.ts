import { hash } from 'bcrypt';

import { supabase } from './supabase';

import { generateSecureSlug, generateSecureKey } from './crypto.server';
import { SLUG_LENGTH, DESTRUCTION_KEY_BYTES } from '@/constants/url';

export async function createUrl(
  encryptedUrl: string,
  passwordProtected: boolean = false,
) {
  let slugExists = true;
  let slug;

  do {
    slug = generateSecureSlug(SLUG_LENGTH);

    const { data } = await supabase
      .from('katana.urls')
      .select('id')
      .eq('slug', slug)
      .limit(1);

    if (data?.length) slugExists = true;
    else slugExists = false;
  } while (slugExists);

  const destructionKey = generateSecureKey(DESTRUCTION_KEY_BYTES);
  const destructionKeyHash = await hash(destructionKey, 12);

  await supabase.from('katana.urls').insert([
    {
      destruction_key: destructionKeyHash,
      encrypted_url: encryptedUrl,
      password_protected: passwordProtected,
      slug,
    },
  ]);

  return { destructionKey: `${slug}:${destructionKey}`, slug };
}

export async function getEncryptedUrl(slug: string) {
  const { data } = await supabase
    .from('katana.urls')
    .select('encrypted_url, password_protected')
    .eq('slug', slug)
    .single();

  return data;
}
