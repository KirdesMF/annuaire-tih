import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { db } from "~/db";
import { companiesTable, type CompanyStatus } from "~/db/schema/companies";
import * as v from "valibot";
import { companyCategoriesTable } from "~/db/schema/company-categories";
import { and, eq } from "drizzle-orm";
import { PgSelect } from "drizzle-orm/pg-core";

const status: CompanyStatus[] = ["active", "rejected", "pending"];

const GetCompaniesSchema = v.object({
  status: v.optional(v.picklist(status)),
});

type GetCompaniesFilters = v.InferOutput<typeof GetCompaniesSchema>;

export const getCompanies = createServerFn({ method: "GET" })
  .validator((data: unknown) => v.parse(GetCompaniesSchema, data))
  .handler(async ({ data }) => {
    try {
      const query = db.select().from(companiesTable);

      return await query;
    } catch (error) {
      console.error(error);
    }
  });

export function companiesQuery(filters: GetCompaniesFilters = {}) {
  return queryOptions({
    queryKey: ["companies", filters],
    queryFn: () => getCompanies({ data: filters }),
  });
}
