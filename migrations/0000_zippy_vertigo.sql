CREATE TABLE IF NOT EXISTS "urls_table" (
	"clicks" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"destruction_key" text NOT NULL,
	"encrypted_url" text NOT NULL,
	"expires_after" integer,
	"expires_at" timestamp,
	"hashed_slug" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"is_password_protected" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp NOT NULL
);
