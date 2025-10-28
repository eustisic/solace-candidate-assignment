CREATE TABLE IF NOT EXISTS "advocates" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"city" text NOT NULL,
	"degree" text NOT NULL,
	"payload" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"years_of_experience" integer NOT NULL,
	"phone_number" bigint NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_advocates_first_name" ON "advocates" ("first_name");
CREATE INDEX IF NOT EXISTS "idx_advocates_last_name" ON "advocates" ("last_name");
CREATE INDEX IF NOT EXISTS "idx_advocates_city" ON "advocates" ("city");
CREATE INDEX IF NOT EXISTS "idx_advocates_years_of_experience" ON "advocates" ("years_of_experience");
