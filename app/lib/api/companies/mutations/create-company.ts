import { createServerFn } from "@tanstack/react-start";
import { decode } from "decode-formdata";
import { eq } from "drizzle-orm";
import * as v from "valibot";
import { getDb } from "~/db";
import { companiesTable } from "~/db/schema/companies";
import { companyCategoriesTable } from "~/db/schema/company-categories";
import { uploadImageToCloudinary } from "~/lib/cloudinary";
import { CreateCompanySchema } from "~/lib/validator/company.schema";
import { generateUniqueSlug } from "~/utils/slug";

/**
 * Create a company
 * @todo: attempt to generate a unique slug
 * @todo: get user id from form data
 */
export const createCompany = createServerFn({ method: "POST" })
  .validator((data: FormData) => {
    const decodedFormData = decode(data, {
      files: ["logo", "gallery.$"],
      arrays: ["categories", "gallery"],
      booleans: ["rqth"],
    });

    return v.parse(CreateCompanySchema, decodedFormData);
  })
  .handler(async ({ data }) => {
    const { logo, gallery, categories, ...rest } = data;

    try {
      const db = getDb();

      await db.transaction(async (tx) => {
        const [company] = await tx
          .insert(companiesTable)
          .values({ ...rest, created_by: data.user_id, slug: generateUniqueSlug(data.name) })
          .returning();

        // Insert categories
        await tx.insert(companyCategoriesTable).values(
          categories.map((category) => ({
            company_id: company.id,
            category_id: category,
          })),
        );

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
        if (gallery?.length) {
          // Filter out empty files
          const validGalleryImages = gallery.filter((image) => image && image.size > 0);

          if (validGalleryImages.length > 0) {
            const uploadedImages = await uploadImages({
              type: "gallery",
              images: validGalleryImages,
              companyId: company.id,
              companySlug: company.slug,
            });

            await tx
              .update(companiesTable)
              .set({ gallery: uploadedImages })
              .where(eq(companiesTable.id, company.id));
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  });

type UploadImages = {
  images: File[];
  companyId: string;
  companySlug: string;
  type: "logo" | "gallery";
};

async function uploadImages({ images, companyId, companySlug, type }: UploadImages) {
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
