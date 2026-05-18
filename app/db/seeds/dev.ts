import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as analyticsSchema from "../schema/analytics";
import * as authSchema from "../schema/auth";
import * as categoriesSchema from "../schema/categories";
import { categoriesTable } from "../schema/categories";
import * as cguSchema from "../schema/cgu";
import { cguTable } from "../schema/cgu";
import * as companiesSchema from "../schema/companies";
import * as companyCategoriesSchema from "../schema/company-categories";

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
] as const;

const schema = {
  ...analyticsSchema,
  ...authSchema,
  ...categoriesSchema,
  ...cguSchema,
  ...companiesSchema,
  ...companyCategoriesSchema,
};

function getSeedDb() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const client = postgres(connectionString, {
    prepare: false,
    fetch_types: false,
    max: 1,
    idle_timeout: 2,
    connect_timeout: 10,
  });

  return drizzle({ client, schema });
}

async function seedCategories(): Promise<void> {
  const db = getSeedDb();
  const existingCategories = await db
    .select({ name: categoriesTable.name })
    .from(categoriesTable)
    .where(sql`${categoriesTable.name} IN ${PREDEFINED_CATEGORIES}`);

  const existingNames = new Set(existingCategories.map((category) => category.name));
  const missingCategories = PREDEFINED_CATEGORIES.filter((name) => !existingNames.has(name));

  if (missingCategories.length === 0) {
    console.log("✅ Categories already seeded");
    return;
  }

  await db
    .insert(categoriesTable)
    .values(missingCategories.map((name) => ({ name })))
    .onConflictDoNothing();

  console.log(`🌱 Added ${missingCategories.length} categories`);
}

async function seedCgu(): Promise<void> {
  const db = getSeedDb();
  const existingActiveCgu = await db.query.cguTable.findFirst({
    where: (cgu, { eq }) => eq(cgu.isActive, true),
  });

  if (existingActiveCgu) {
    console.log("✅ Active CGU already seeded");
    return;
  }

  await db.insert(cguTable).values({
    version: "dev-1",
    content: "Conditions générales d'utilisation de développement.",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("🌱 Added active dev CGU");
}

async function seedDev(): Promise<void> {
  await seedCategories();
  await seedCgu();
}

seedDev()
  .then(() => {
    console.log("✅ Dev database seeded");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Dev database seed failed", error);
    process.exit(1);
  });
