import { eq, sql } from "drizzle-orm";
// src/db/seed-categories.ts
import { db } from "~/db";
import { categoriesTable } from "../schema/categories";

// Predefined categories (French-friendly)
const PREDEFINED_CATEGORIES = [
  "Administratif et juridique",
  "Agroalimentaire",
  "Arts graphiques et création artistique",
  "Bien-être et beauté",
  "Communication et médias",
  "Construction",
  "Formation initiale et continue",
  "Informatique",
  "Marketing et commerce",
  "Meubles, textiles, et autres activités de manufacture",
  "RSE-QVT",
  "Santé et social",
  "Services à la personne",
  "Services",
  "Services aux entreprises",
  "Spiritualité",
  "Sports, loisirs et divertissements",
  "Transports",
] as const; // <-- Ensures type safety

export async function seedCategories() {
  try {
    // 1. Check existing categories in a SINGLE query (optimized)
    const existingCategories = await db
      .select({ name: categoriesTable.name })
      .from(categoriesTable)
      .where(sql`${categoriesTable.name} IN ${PREDEFINED_CATEGORIES}`);

    // 2. Identify missing categories
    const existingNames = new Set(existingCategories.map((c) => c.name));
    const missingCategories = PREDEFINED_CATEGORIES.filter((name) => !existingNames.has(name));

    // 3. Insert missing categories in a SINGLE batch
    if (missingCategories.length > 0) {
      await db
        .insert(categoriesTable)
        .values(missingCategories.map((name) => ({ name })))
        .onConflictDoNothing(); // Final safety net

      console.log(`🌱 Added ${missingCategories.length} categories:`, missingCategories);
      return { added: missingCategories };
    }

    console.log("✅ All categories already exist");
    return { added: [] };
  } catch (error) {
    console.error("❌ Category seeding failed:", error);
    throw error; // Let calling code handle
  } finally {
    // close the process
    process.exit(0);
  }
}

// Run if executed directly (e.g. `npm run seed`)
if (import.meta.url.endsWith(process.argv[1])) {
  seedCategories();
}
