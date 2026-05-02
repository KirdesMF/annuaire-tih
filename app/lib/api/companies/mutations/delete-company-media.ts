import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { getDb } from "~/db";
import { companiesTable } from "~/db/schema/companies";
import { requireCompanyManager } from "~/lib/auth/permissions.server";
import { deleteImageFromCloudinary } from "~/lib/cloudinary";

export const deleteCompanyLogo = createServerFn({ method: "POST" })
  .inputValidator((data: { companyId: string; publicId: string }) => data)
  .handler(async ({ data }) => {
    const { companyId, publicId } = data;
    await requireCompanyManager(companyId);

    const [company] = await getDb()
      .select({ logo: companiesTable.logo })
      .from(companiesTable)
      .where(eq(companiesTable.id, companyId));

    if (company?.logo?.publicId !== publicId) {
      throw new Error("Accès non autorisé");
    }

    await deleteImageFromCloudinary(publicId);
    await getDb()
      .update(companiesTable)
      .set({ logo: null })
      .where(eq(companiesTable.id, companyId));
  });

type Data = {
  companyId: string;
  publicId: string;
  type: "logo" | "gallery";
  index?: number;
};

export const deleteCompanyMedia = createServerFn({ method: "POST" })
  .inputValidator((data: Data) => data)
  .handler(async ({ data }) => {
    const { companyId, publicId, type, index } = data;
    await requireCompanyManager(companyId);

    const db = getDb();

    if (type === "logo") {
      await deleteImageFromCloudinary(publicId);
      await db.update(companiesTable).set({ logo: null }).where(eq(companiesTable.id, companyId));
    }

    if (type === "gallery") {
      const [company] = await db
        .select()
        .from(companiesTable)
        .where(eq(companiesTable.id, companyId));

      if (!company) throw new Error("Company not found");

      if (typeof index !== "number" || company.gallery[index]?.publicId !== publicId) {
        throw new Error("Accès non autorisé");
      }

      const gallery = company.gallery.filter((_, i) => i !== index);

      await deleteImageFromCloudinary(publicId);
      await db.update(companiesTable).set({ gallery }).where(eq(companiesTable.id, companyId));
    }
  });
