import { supabase } from '@/lib/supabase';
import type { Url } from '@/types/url';

class UrlRepository {
  private table = 'katana.urls';

  async createUrl(url: Partial<Url>) {
    const { data, error } = await supabase
      .from(this.table)
      .insert([url])
      .select('id')
      .single();

    if (error) throw error;

    return data;
  }

  async getUrl(hashedIdentifier: string) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('hashed_identifier', hashedIdentifier);

    if (error) throw error;

    return data[0] || null;
  }

  async updateUrl(
    id: string,
    updatedUrl: Partial<Omit<Url, 'id' | 'created_at'>>,
  ) {
    const { data, error } = await supabase
      .from(this.table)
      .update(updatedUrl)
      .eq('id', id);

    if (error) throw error;

    return data;
  }
}

export const urlRepository = new UrlRepository();
