import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePostgres } from 'drizzle-orm/node-postgres';
import { neon } from '@neondatabase/serverless';

import { config } from '@/config';

let db;

if (config.deployment.runtime === 'cloudflare') {
  const sql = neon(import.meta.env.DATABASE_URL!);

  db = drizzleNeon(sql);
} else {
  db = drizzlePostgres(import.meta.env.DATABASE_URL!);
}

export { db };
