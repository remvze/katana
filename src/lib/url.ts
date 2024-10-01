import { supabase } from './supabase';

import { generateSecureSlug } from './crypto.server';
import { SLUG_LENGTH } from '@/constants/url';

export async function createUrl(encryptedUrl: string) {
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
      slug,
    },
  ]);

  return slug;
}

export async function getEncryptedUrl(slug: string) {
  const { data } = await supabase
    .from('katana.urls')
    .select('encrypted_url')
    .eq('slug', slug)
    .single();

  return data;
}
