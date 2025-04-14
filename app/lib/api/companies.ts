import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { companiesTable, type CompanyGallery } from "~/db/schema/companies";
import { AddCompanySchema, type AddCompanyData } from "../validator/company.schema";
import { getWebRequest } from "@tanstack/react-start/server";
import { auth } from "~/lib/auth/auth.server";
import { redirect } from "@tanstack/react-router";
import * as v from "valibot";
import { companyCategoriesTable } from "~/db/schema/company-categories";
import { uploadImageToCloudinary } from "../cloudinary";
import { decode } from "decode-formdata";
/**
 * Add a company
 * @param data - The data of the company to add
 */
export const addCompany = createServerFn({ method: "POST" })
	.validator((formData: FormData) => {
		const decodedFormData = decode(formData, {
			files: ["logo", "gallery"],
			arrays: ["categories", "gallery"],
			booleans: ["rqth"],
		});
		return v.parse(AddCompanySchema, decodedFormData);
	})
	.handler(async ({ data }) => {
		const request = getWebRequest();
		if (!request) throw new Error("Request not found");

		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) throw redirect({ to: "/login" });

		const { logo, gallery, categories, ...rest } = data;

		try {
			await db.transaction(async (tx) => {
				const [company] = await tx
					.insert(companiesTable)
					.values({
						...rest,
						user_id: session.user.id,
						created_by: session.user.id,
					})
					.returning();

				// Upload logo
				if (logo && logo.size > 0) {
					const { secure_url, public_id } = await uploadImageToCloudinary({
						file: logo,
						companyId: company.id,
						type: "logo",
					});

					await tx
						.update(companiesTable)
						.set({
							logo: { secureUrl: secure_url, publicId: public_id },
						})
						.where(eq(companiesTable.id, company.id));
				}

				// Upload gallery
				if (gallery && gallery.length > 0) {
					const uploadedImages: CompanyGallery = [];
					for (const image of gallery) {
						if (uploadedImages.length >= 2) break;

						const { secure_url, public_id } = await uploadImageToCloudinary({
							file: image,
							companyId: company.id,
							type: "gallery",
						});

						uploadedImages.push({ secureUrl: secure_url, publicId: public_id });
					}

					await tx
						.update(companiesTable)
						.set({
							gallery: uploadedImages,
						})
						.where(eq(companiesTable.id, company.id));
				}

				// Insert categories
				await tx.insert(companyCategoriesTable).values(
					categories.map((category) => ({
						company_id: company.id,
						category_id: category,
					})),
				);
			});
		} catch (error) {
			console.error(error);
		}
	});

/**
 * Delete a company
 * @param companyId - The ID of the company to delete
 */
export const deleteCompany = createServerFn({ method: "POST" })
	.validator((companyId: string) => companyId as string)
	.handler(async ({ data: companyId }) => {
		try {
			await db.delete(companiesTable).where(eq(companiesTable.id, companyId));
		} catch (error) {
			console.error(error);
		}
	});
