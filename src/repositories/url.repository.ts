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

  async getUrl(hashedSlug: string) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('hashed_slug', hashedSlug);

    if (error) throw error;

    if (data[0]?.is_deleted) return null;

    return data[0] || null;
  }

  async getUrlById(id: string) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id);

    if (error) throw error;

    if (data[0]?.is_deleted) return null;

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

  async deleteUrl(id: string) {
    const { data, error } = await supabase
      .from(this.table)
      .update({ encrypted_url: '[DELETED]', is_deleted: true })
      .eq('id', id);

    if (error) throw error;

    return data;
  }
}

export const urlRepository = new UrlRepository();
