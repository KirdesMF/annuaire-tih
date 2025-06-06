import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { desc } from "drizzle-orm";
import * as v from "valibot";
import { getDb } from "~/db";
import { type CompanyStatus, companiesTable } from "~/db/schema/companies";

const status: CompanyStatus[] = ["active", "rejected", "pending"];

const GetCompaniesSchema = v.object({
  status: v.optional(v.picklist(status)),
});

type GetCompaniesFilters = v.InferOutput<typeof GetCompaniesSchema>;

export const getCompanies = createServerFn({ method: "GET" })
  .validator((data: unknown) => v.parse(GetCompaniesSchema, data))
  .handler(async ({ data }) => {
    try {
      const query = getDb().select().from(companiesTable).orderBy(desc(companiesTable.created_at));

      return await query;
    } catch (error) {
      console.error(error);
    }
  });

export function companiesQuery(filters: GetCompaniesFilters = {}) {
  return queryOptions({
    queryKey: ["companies"],
    queryFn: () => getCompanies({ data: filters }),
  });
}
