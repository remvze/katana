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
}

export const urlRepository = new UrlRepository();
