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
