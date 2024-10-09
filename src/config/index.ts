import { supabaseConfig } from './supabase';
import { turnstileConfig } from './turnstile';
import { mongodbConfig } from './mongodb';
import { otherConfig } from './other';

export const config = {
  mongodb: mongodbConfig,
  other: otherConfig,
  supabase: supabaseConfig,
  turnstile: turnstileConfig,
};
