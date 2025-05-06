import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { type CompanyStatus, companiesTable } from "~/db/schema/companies";

export const updateCompanyStatus = createServerFn({ method: "POST" })
  .validator((data: { companyId: string; status: CompanyStatus }) => data)
  .handler(async ({ data: { companyId, status } }) => {
    try {
      await db.update(companiesTable).set({ status }).where(eq(companiesTable.id, companyId));
    } catch (error) {
      console.error("Failed to update company status:", error);
      throw new Error("Failed to update company status");
    }
  });
