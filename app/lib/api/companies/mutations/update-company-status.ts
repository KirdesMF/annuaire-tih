import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { getDb } from "~/db";
import { type CompanyStatus, companiesTable } from "~/db/schema/companies";
import { requireAdminUser } from "~/lib/auth/permissions.server";

export const updateCompanyStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { companyId: string; status: CompanyStatus }) => data)
  .handler(async ({ data: { companyId, status } }) => {
    await requireAdminUser();

    try {
      await getDb().update(companiesTable).set({ status }).where(eq(companiesTable.id, companyId));
    } catch (error) {
      throw new Error("Failed to update company status", { cause: error });
    }
  });
