import { supabase } from '@/lib/supabase';

interface Url {
  created_at: number;
  destruction_key: string;
  encrypted_url: string;
  hashed_identifier: string;
  id: string;
  is_deleted: boolean;
  is_password_protected: boolean;
}

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
