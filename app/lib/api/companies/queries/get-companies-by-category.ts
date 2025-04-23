import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { db } from "~/db";
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
    const query = await db
      .select()
      .from(companiesTable)
      .where(
        and(eq(companyCategoriesTable.category_id, categoryId), eq(companiesTable.status, status)),
      );

    return query;
  });

export function companiesByCategoryQuery(data: GetCompaniesByCategoryData) {
  return queryOptions({
    queryKey: ["companies", "category", data],
    queryFn: () => getCompaniesByCategory({ data }),
  });
}
