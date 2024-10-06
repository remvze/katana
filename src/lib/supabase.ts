import { createClient } from '@supabase/supabase-js';

import { config } from '@/config';

const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.key;

export const supabase = createClient(supabaseUrl, supabaseKey);
