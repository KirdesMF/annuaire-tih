import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { getDb } from "~/db";
import { companiesTable } from "~/db/schema/companies";
import { requireCompanyManager } from "~/lib/auth/permissions.server";
import { deleteCompanyFromCloudinary } from "~/lib/cloudinary";

export const deleteCompany = createServerFn({ method: "POST" })
  .inputValidator((data: { companyId: string; companySlug: string }) => data)
  .handler(async ({ data: { companyId } }) => {
    await requireCompanyManager(companyId);

    try {
      const db = getDb();
      const [company] = await db
        .select({ slug: companiesTable.slug })
        .from(companiesTable)
        .where(eq(companiesTable.id, companyId));

      if (!company) throw new Error("Company not found");

      await db.delete(companiesTable).where(eq(companiesTable.id, companyId));

      // Delete all images from Cloudinary
      await deleteCompanyFromCloudinary(company.slug);
    } catch (error) {
      throw new Error("Failed to delete company", { cause: error });
    }
  });
