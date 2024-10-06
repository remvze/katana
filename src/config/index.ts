import { supabaseConfig } from './supabase';
import { turnstileConfig } from './turnstile';
import { otherConfig } from './other';

export const config = {
  other: otherConfig,
  supabase: supabaseConfig,
  turnstile: turnstileConfig,
};
