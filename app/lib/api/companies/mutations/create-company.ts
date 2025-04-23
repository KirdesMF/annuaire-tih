import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { companiesTable } from "~/db/schema/companies";
import { type CreateCompanyData, CreateCompanySchema } from "~/lib/validator/company.schema";
import * as v from "valibot";
import { companyCategoriesTable } from "~/db/schema/company-categories";
import { uploadImageToCloudinary } from "~/lib/cloudinary";
import { decode } from "decode-formdata";
import { generateUniqueSlug } from "~/utils/slug";

async function uploadImages({
  images,
  companyId,
  companySlug,
  type,
}: { images: File[]; companyId: string; companySlug: string; type: "logo" | "gallery" }) {
  const uploadedImages: Array<{ secureUrl: string; publicId: string }> = [];

  for (const image of images) {
    const res = await uploadImageToCloudinary({
      file: image,
      companyId,
      companySlug,
      type,
    });

    if (res instanceof Error) throw res;

    const { secure_url, public_id } = res;
    uploadedImages.push({ secureUrl: secure_url, publicId: public_id });
  }

  return uploadedImages;
}

async function insertCategories(companyId: string, categories: string[]) {
  await db.insert(companyCategoriesTable).values(
    categories.map((category) => ({
      company_id: companyId,
      category_id: category,
    })),
  );
}

async function insertCompany(data: Omit<CreateCompanyData, "categories" | "logo" | "gallery">) {
  const [company] = await db
    .insert(companiesTable)
    .values({ ...data, created_by: data.user_id, slug: generateUniqueSlug(data.name) })
    .returning();

  return company;
}

/**
 * Create a company
 * @todo: attempt to generate a unique slug
 * @todo: get user id from form data
 */
export const createCompany = createServerFn({ method: "POST" })
  .validator((data: FormData) => {
    const decodedFormData = decode(data, {
      files: ["logo", "gallery"],
      arrays: ["categories", "gallery"],
      booleans: ["rqth"],
    });

    return v.parse(CreateCompanySchema, decodedFormData);
  })
  .handler(async ({ data }) => {
    const { logo, gallery, categories, ...rest } = data;

    try {
      await db.transaction(async (tx) => {
        const company = await insertCompany(rest);

        // Insert categories
        await insertCategories(company.id, categories);

        // Upload logo
        // @todo: handle errors
        if (logo && logo.size > 0) {
          const uploadedImage = await uploadImages({
            type: "logo",
            images: [logo],
            companyId: company.id,
            companySlug: company.slug,
          });

          await tx
            .update(companiesTable)
            .set({ logo: uploadedImage[0] })
            .where(eq(companiesTable.id, company.id));
        }

        // Upload gallery
        // @todo: handle errors
        if (gallery && gallery.length > 0) {
          const uploadedImages = await uploadImages({
            type: "gallery",
            images: gallery,
            companyId: company.id,
            companySlug: company.slug,
          });

          await tx
            .update(companiesTable)
            .set({ gallery: uploadedImages })
            .where(eq(companiesTable.id, company.id));
        }
      });
    } catch (error) {
      console.error(error);
    }
  });
