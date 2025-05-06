import { eq } from "drizzle-orm";

import { createServerFn } from "@tanstack/react-start";
import { decode } from "decode-formdata";
import * as v from "valibot";
import { db } from "~/db";
import { companiesTable } from "~/db/schema/companies";
import { updateImageInCloudinary, uploadImageToCloudinary } from "~/lib/cloudinary";
import {
  GalleryCompanySchema,
  LogoCompanySchema,
  UpdateCompanyMediaSchema,
} from "~/lib/validator/company.schema";

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
      arrays: ["gallery", "gallery_public_id"],
    });

    console.log(decodedFormData);

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
      if (logo && logo.size > 0) {
        const logoResult = logo_public_id
          ? await updateImageInCloudinary({
              file: logo,
              publicId: logo_public_id,
            })
          : await uploadImageToCloudinary({
              type: "logo",
              file: logo,
              companyId,
              companySlug: company.slug,
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

export const updateCompanyLogo = createServerFn({ method: "POST" })
  .validator((data: FormData) => {
    const decodedFormData = decode(data, {
      files: ["logo"],
    });
    return v.parse(LogoCompanySchema, decodedFormData);
  })
  .handler(async ({ data }) => {
    const { logo, logo_public_id, companyId } = data;

    if (!logo?.size) throw new Error("Aucune image de logo fournie");

    const [company] = await db
      .select()
      .from(companiesTable)
      .where(eq(companiesTable.id, companyId));

    const { secure_url, public_id } = logo_public_id
      ? await updateImageInCloudinary({
          file: logo,
          publicId: logo_public_id,
        })
      : await uploadImageToCloudinary({
          type: "logo",
          file: logo,
          companyId,
          companySlug: company.slug,
        });

    await db
      .update(companiesTable)
      .set({ logo: { secureUrl: secure_url, publicId: public_id } })
      .where(eq(companiesTable.id, companyId));

    return { secure_url, public_id };
  });

export const updateCompanyGallery = createServerFn({ method: "POST" })
  .validator((data: FormData) => {
    const decodedFormData = decode(data, {
      files: ["gallery"],
      arrays: ["gallery", "gallery_public_id"],
    });
    return v.parse(GalleryCompanySchema, decodedFormData);
  })
  .handler(async ({ data }) => {
    const { gallery, gallery_public_id, companyId } = data;

    if (!gallery) throw new Error("Aucune image de galerie fournie");

    const [company] = await db
      .select()
      .from(companiesTable)
      .where(eq(companiesTable.id, companyId));

    const updatedGallery = [...(company.gallery || [])];

    await Promise.all(
      gallery.map(async (image, index) => {
        if (!image.size) return;

        // Handle both new uploads and updates
        const imageResult = gallery_public_id?.[index]
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

    await db
      .update(companiesTable)
      .set({ gallery: updatedGallery })
      .where(eq(companiesTable.id, companyId));

    return updatedGallery;
  });
