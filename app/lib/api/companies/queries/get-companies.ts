import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import * as v from "valibot";
import { getDb } from "~/db";
import { companiesTable } from "~/db/schema/companies";
import { requireAdminUser } from "~/lib/auth/permissions.server";

const status = ["active", "rejected", "pending", "all"] as const;

const GetCompaniesSchema = v.object({
  status: v.optional(v.picklist(status)),
});

type GetCompaniesFilters = v.InferOutput<typeof GetCompaniesSchema>;

export const getCompanies = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => v.parse(GetCompaniesSchema, data))
  .handler(async ({ data }) => {
    const query = getDb().select().from(companiesTable).orderBy(desc(companiesTable.created_at));

    if (data.status === "all") {
      await requireAdminUser();
      return await query;
    }

    const status = data.status ?? "active";
    return await query.where(eq(companiesTable.status, status));
  });

export function companiesQuery(filters: GetCompaniesFilters = { status: "active" }) {
  return queryOptions({
    queryKey: ["companies"],
    queryFn: () => getCompanies({ data: filters }),
  });
}
