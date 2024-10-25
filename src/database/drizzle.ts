import {
  drizzle as drizzleNeon,
  type NeonHttpDatabase,
} from 'drizzle-orm/neon-http';

import {
  drizzle as drizzlePostgres,
  type NodePgDatabase,
} from 'drizzle-orm/node-postgres';

import { neon } from '@neondatabase/serverless';

import { config } from '@/config';

let db:
  | NeonHttpDatabase<Record<string, never>>
  | NodePgDatabase<Record<string, never>>;

if (config.deployment.runtime === 'cloudflare') {
  const sql = neon(import.meta.env.DATABASE_URL!);

  db = drizzleNeon(sql);
} else {
  db = drizzlePostgres(import.meta.env.DATABASE_URL!);
}

export { db };
