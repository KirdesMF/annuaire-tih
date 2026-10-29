import * as v from "valibot";

// Category IDs are generated with nanoid(32) in app/db/schema/categories.ts.
export const CategoryIdSchema = v.pipe(v.string(), v.length(32), v.regex(/^[A-Za-z0-9_-]+$/));

export const CategorySearchSchema = v.object({
  id: CategoryIdSchema,
  name: v.pipe(v.string(), v.nonEmpty(), v.maxLength(255)),
});

export const PublicCategoryCompaniesSchema = v.object({
  categoryId: CategoryIdSchema,
  status: v.literal("active"),
});
