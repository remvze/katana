import { supabase } from './supabase';

import { generateSecureSlug } from './crypto.server';

export async function createUrl(original: string) {
  let slugExists = true;
  let slug;

  do {
    slug = generateSecureSlug(10);

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
      original_url: original,
      slug,
    },
  ]);

  return slug;
}

export async function getUrl(slug: string) {
  const { data } = await supabase
    .from('katana.urls')
    .select('original_url')
    .eq('slug', slug)
    .single();

  return data;
}
