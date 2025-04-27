import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { getDb } from "~/db";
import { companiesTable, COMPANY_STATUSES } from "~/db/schema/companies";
import * as v from "valibot";
import { companyCategoriesTable } from "~/db/schema/company-categories";
import { queryOptions } from "@tanstack/react-query";

const GetCompaniesByCategorySchema = v.object({
  categoryId: v.string(),
  status: v.picklist(COMPANY_STATUSES),
});

type GetCompaniesByCategoryData = v.InferOutput<typeof GetCompaniesByCategorySchema>;

export const getCompaniesByCategory = createServerFn({ method: "GET" })
  .validator((data: unknown) => v.parse(GetCompaniesByCategorySchema, data))
  .handler(async ({ data: { categoryId, status = "active" } }) => {
    const query = await getDb()
      .select()
      .from(companiesTable)
      .innerJoin(companyCategoriesTable, eq(companiesTable.id, companyCategoriesTable.company_id))
      .where(
        and(eq(companyCategoriesTable.category_id, categoryId), eq(companiesTable.status, status)),
      );

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
