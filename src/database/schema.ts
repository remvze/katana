import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';

export const urlsTable = pgTable('urls_table', {
  clicks: integer('clicks').default(0).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  destructionKey: text('destruction_key').notNull(),
  encryptedUrl: text('encrypted_url').notNull(),
  expiresAfter: integer('expires_after'),
  expiresAt: timestamp('expires_at'),
  hashedSlug: text('hashed_slug').notNull(),
  id: serial('id').primaryKey(),
  isPasswordProtected: boolean('is_password_protected')
    .notNull()
    .default(false),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertUrl = typeof urlsTable.$inferInsert;
export type SelectUrl = typeof urlsTable.$inferSelect;

export const statsTable = pgTable('stats_table', {
  createdAt: timestamp('created_at').notNull().defaultNow(),
  date: timestamp('date').notNull(),
  id: serial('id').primaryKey(),
  totalClicks: integer().default(0).notNull(),
  totalLinksCreated: integer('total_links_created').default(0).notNull(),
  totalLinksDeleted: integer('total_links_deleted').default(0).notNull(),
  totalLinksExpired: integer('total_links_expired').default(0).notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertStat = typeof statsTable.$inferInsert;
export type SelectStat = typeof statsTable.$inferSelect;
