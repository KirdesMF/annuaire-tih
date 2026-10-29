import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { and, eq } from "drizzle-orm";
import * as v from "valibot";
import { getDb } from "~/db";
import { companiesTable } from "~/db/schema/companies";
import { companyCategoriesTable } from "~/db/schema/company-categories";

import { PublicCategoryCompaniesSchema } from "~/lib/validator/category.schema";

type GetCompaniesByCategoryData = v.InferOutput<typeof PublicCategoryCompaniesSchema>;

export const getCompaniesByCategory = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    const result = v.safeParse(PublicCategoryCompaniesSchema, data);
    if (!result.success) {
      setResponseStatus(400);
      throw new Error("Requête de catégorie invalide");
    }
    return result.output;
  })
  .handler(async ({ data: { categoryId } }) => {
    const query = await getDb()
      .select()
      .from(companiesTable)
      .innerJoin(companyCategoriesTable, eq(companiesTable.id, companyCategoriesTable.company_id))
      .where(
        and(
          eq(companyCategoriesTable.category_id, categoryId),
          eq(companiesTable.status, "active"),
        ),
      )
      .orderBy(companiesTable.name);

    return {
      companies: query.map((data) => data.companies),
      categories: query.map((data) => data.company_categories),
    };
  });

export function companiesByCategoryQuery(data: GetCompaniesByCategoryData) {
  return queryOptions({
    queryKey: ["companies", "category", data],
    queryFn: () => getCompaniesByCategory({ data }),
  });
}
