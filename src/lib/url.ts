import { supabase } from './supabase';

import { generateSecureSlug } from './crypto.server';
import { SLUG_LENGTH } from '@/constants/url';

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

  await supabase.from('katana.urls').insert([
    {
      encrypted_url: encryptedUrl,
      password_protected: passwordProtected,
      slug,
    },
  ]);

  return slug;
}

export async function getEncryptedUrl(slug: string) {
  const { data } = await supabase
    .from('katana.urls')
    .select('encrypted_url, password_protected')
    .eq('slug', slug)
    .single();

  return data;
}
