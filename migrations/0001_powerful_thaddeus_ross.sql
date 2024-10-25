CREATE TABLE IF NOT EXISTS "stats_table" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"date" timestamp,
	"id" serial PRIMARY KEY NOT NULL,
	"totalClicks" integer DEFAULT 0 NOT NULL,
	"total_links_created" integer DEFAULT 0 NOT NULL,
	"total_links_deleted" integer DEFAULT 0 NOT NULL,
	"total_links_expired" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp NOT NULL
);
