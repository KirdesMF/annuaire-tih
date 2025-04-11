import { sql } from "drizzle-orm";
import { db } from "..";

async function main() {
  try {
    console.log("Starting company status migration...");

    await up();

    console.log("Company status migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

export async function up() {
  // 1. Add new varchar column
  await db.execute(sql`
    ALTER TABLE "companies"
    ADD COLUMN "status_new" varchar(50) NOT NULL DEFAULT 'pending'
  `);

  // 2. Copy data from old enum column
  await db.execute(sql`
    UPDATE "companies"
    SET "status_new" = "status"::text
  `);

  // 3. Drop old enum column
  await db.execute(sql`
    ALTER TABLE "companies"
    DROP COLUMN "status"
  `);

  // 4. Rename new column
  await db.execute(sql`
    ALTER TABLE "companies"
    RENAME COLUMN "status_new" TO "status"
  `);

  // 5. Drop the enum type
  await db.execute(sql`DROP TYPE IF EXISTS "company_status"`);
}

export async function down() {
  await db.execute(
    sql`CREATE TYPE company_status AS ENUM ('pending', 'approved', 'rejected')`,
  );
  // ... reverse other steps if needed
}

if (require.main === module) {
  main();
}
