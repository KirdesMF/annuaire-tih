import { sql } from "drizzle-orm";
import { db } from "..";

export async function up() {
  // 1. Add new varchar column
  await db.execute(sql`
     ALTER TABLE "user"
     ADD COLUMN "role_new" varchar(50) NOT NULL DEFAULT 'user'
   `);

  // 2. Copy data from old enum column
  await db.execute(sql`
     UPDATE "user"
     SET "role_new" = "role"::text
   `);

  // 3. Drop old enum column
  await db.execute(sql`
     ALTER TABLE "user"
     DROP COLUMN "role"
   `);

  // 4. Rename new column
  await db.execute(sql`
     ALTER TABLE "user"
     RENAME COLUMN "role_new" TO "role"
   `);

  // 5. Drop the enum type
  await db.execute(sql`DROP TYPE IF EXISTS "role"`);
}

export async function down() {
  // Reverse the process if needed
  await db.execute(
    sql`CREATE TYPE roles_enum AS ENUM ('user', 'admin', 'superadmin')`,
  );
  // ... reverse other steps
}

async function main() {
  try {
    await up();
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

main();
