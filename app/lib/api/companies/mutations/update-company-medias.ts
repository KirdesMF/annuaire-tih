import { eq } from "drizzle-orm";

import { createServerFn } from "@tanstack/react-start";
import { decode } from "decode-formdata";
import { db } from "~/db";
import { companiesTable } from "~/db/schema/companies";
import { UpdateCompanyMediaSchema } from "~/lib/validator/company.schema";
import * as v from "valibot";
import { updateImageInCloudinary, uploadImageToCloudinary } from "~/lib/cloudinary";

const updateCompanyInDb = async (
  companyId: string,
  data: Partial<typeof companiesTable.$inferSelect>,
) => {
  return db.update(companiesTable).set(data).where(eq(companiesTable.id, companyId));
};

export const updateCompanyMedia = createServerFn({ method: "POST" })
  .validator((data: FormData) => {
    const decodedFormData = decode(data, {
      files: ["logo", "gallery"],
      arrays: ["gallery", "galleryPublicId"],
    });
    return v.parse(UpdateCompanyMediaSchema, decodedFormData);
  })
  .handler(async ({ data }) => {
    try {
      const { logo, gallery, logo_public_id, gallery_public_id, companyId } = data;

      // Get current company data once
      const [company] = await db
        .select()
        .from(companiesTable)
        .where(eq(companiesTable.id, companyId));

      // Handle logo update
      if (logo && logo.size > 0 && logo_public_id) {
        const logoResult = await updateImageInCloudinary({
          file: logo,
          publicId: logo_public_id,
        });
        await updateCompanyInDb(companyId, {
          logo: { secureUrl: logoResult.secure_url, publicId: logoResult.public_id },
        });
      }

      // Handle gallery updates
      if (gallery && gallery_public_id) {
        const updatedGallery = [...(company.gallery || [])];

        await Promise.all(
          gallery.map(async (image, index) => {
            if (!image.size) return;

            const imageResult = gallery_public_id[index]
              ? await updateImageInCloudinary({
                  file: image,
                  publicId: gallery_public_id[index],
                })
              : await uploadImageToCloudinary({
                  type: "gallery",
                  file: image,
                  companyId,
                  companySlug: company.slug,
                });

            updatedGallery[index] = {
              secureUrl: imageResult.secure_url,
              publicId: imageResult.public_id,
            };
          }),
        );

        await updateCompanyInDb(companyId, { gallery: updatedGallery });
      }
    } catch (error) {
      console.error("Failed to update company media:", error);
      throw new Error("Failed to update company media");
    }
  });
