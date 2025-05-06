import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { companiesTable } from "~/db/schema/companies";
import { deleteCompanyFromCloudinary } from "~/lib/cloudinary";

export const deleteCompany = createServerFn({ method: "POST" })
  .validator((data: { companyId: string; companySlug: string }) => data)
  .handler(async ({ data: { companyId, companySlug } }) => {
    try {
      await db.delete(companiesTable).where(eq(companiesTable.id, companyId));

      // Delete all images from Cloudinary
      await deleteCompanyFromCloudinary(companySlug);
    } catch (error) {
      console.error(error);
    }
  });
