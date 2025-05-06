import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { decode } from "decode-formdata";
import { eq } from "drizzle-orm";
import * as v from "valibot";
import { getDb } from "~/db";
import { companiesTable } from "~/db/schema/companies";
import { companyCategoriesTable } from "~/db/schema/company-categories";
import { uploadImageToCloudinary } from "~/lib/cloudinary";
import { type CreateCompanyData, CreateCompanySchema } from "~/lib/validator/company.schema";
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
  await getDb()
    .insert(companyCategoriesTable)
    .values(
      categories.map((category) => ({
        company_id: companyId,
        category_id: category,
      })),
    );
}

async function insertCompany(data: Omit<CreateCompanyData, "categories" | "logo" | "gallery">) {
  const [company] = await getDb()
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
    const values = {
      ...Object.fromEntries(data.entries()),
      logo: data.get("logo"),
      "gallery[0]": data.get("gallery[0]"),
      "gallery[1]": data.get("gallery[1]"),
    };

    const logo = data.get("logo");
    const gallery = [data.get("gallery[0]"), data.get("gallery[1]")];

    console.log("logo", logo);
    console.log("gallery", gallery);

    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
      formData.append(key, value as string);
    }

    const decodedFormData = decode(formData, {
      files: ["logo", "gallery"],
      arrays: ["categories", "gallery"],
      booleans: ["rqth"],
    });

    console.log("decodedFormData", decodedFormData);
    console.log("formData", formData);
    console.log("values", values);

    return v.parse(CreateCompanySchema, decodedFormData);
  })
  .handler(async ({ data }) => {
    const { logo, gallery, categories, ...rest } = data;

    try {
      await getDb().transaction(async (tx) => {
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
        if (gallery?.some((image) => image.size > 0)) {
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
