import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { companiesTable, type CompanyStatus, type CompanyGallery } from "~/db/schema/companies";
import { AddCompanySchema, type AddCompanyData } from "../validator/company.schema";
import { getWebRequest } from "@tanstack/react-start/server";
import { auth } from "~/lib/auth/auth.server";
import { redirect } from "@tanstack/react-router";
import * as v from "valibot";
import { companyCategoriesTable } from "~/db/schema/company-categories";
import { uploadImageToCloudinary } from "../cloudinary";
import { decode } from "decode-formdata";
import { queryOptions } from "@tanstack/react-query";
import { categoriesTable } from "~/db/schema/categories";

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

		const { logo, gallery, categories, facebook, instagram, linkedin, calendly, ...rest } = data;

		try {
			await db.transaction(async (tx) => {
				const [company] = await tx
					.insert(companiesTable)
					.values({
						...rest,
						social_media: { facebook, instagram, linkedin, calendly },
						user_id: session.user.id,
						created_by: session.user.id,
					})
					.returning();

				// Upload logo
				// @todo: handle errors
				if (logo && logo.size > 0) {
					const res = await uploadImageToCloudinary({
						file: logo,
						companyId: company.id,
						companyName: company.name,
						type: "logo",
					});

					if (res instanceof Error) throw res;
					const { secure_url, public_id } = res;

					await tx
						.update(companiesTable)
						.set({
							logo: { secureUrl: secure_url, publicId: public_id },
						})
						.where(eq(companiesTable.id, company.id));
				}

				// Upload gallery
				// @todo: handle errors
				if (gallery && gallery.length > 0) {
					const uploadedImages: CompanyGallery = [];
					for (const image of gallery) {
						if (uploadedImages.length >= 2) break;

						const res = await uploadImageToCloudinary({
							file: image,
							companyId: company.id,
							companyName: company.name,
							type: "gallery",
						});

						if (res instanceof Error) throw res;
						const { secure_url, public_id } = res;

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

/**
 * Get a company
 * @param id - The ID of the company to get
 */
export const getCompany = createServerFn({ method: "GET" })
	.validator((id: string) => id as string)
	.handler(async ({ data: id }) => {
		try {
			const company = await db
				.select()
				.from(companiesTable)
				.where(eq(companiesTable.id, id))
				.limit(1)
				.then((res) => res[0]);

			const categories = await db
				.select()
				.from(companyCategoriesTable)
				.leftJoin(categoriesTable, eq(categoriesTable.id, companyCategoriesTable.category_id))
				.where(eq(companyCategoriesTable.company_id, company.id));

			return {
				...company,
				categories: categories.map((c) => c.categories?.name),
			};
		} catch (error) {
			console.error(error);
		}
	});

export function setCompanyQueryOptions(id: string) {
	return queryOptions({
		queryKey: ["company", id],
		queryFn: () => getCompany({ data: id }),
		staleTime: 1000 * 60 * 60 * 24,
	});
}

/**
 * Get all companies
 */
export const getAllCompanies = createServerFn({ method: "GET" }).handler(async () => {
	try {
		const companies = await db.select().from(companiesTable);
		return companies;
	} catch (error) {
		console.error(error);
	}
});

export const allCompaniesQueryOptions = queryOptions({
	queryKey: ["companies"],
	queryFn: () => getAllCompanies(),
});

export const updateCompanyStatus = createServerFn({ method: "POST" })
	.validator((data: unknown) => data as { companyId: string; status: CompanyStatus })
	.handler(async ({ data: { companyId, status } }) => {
		try {
			await db.update(companiesTable).set({ status }).where(eq(companiesTable.id, companyId));
		} catch (error) {
			console.error(error);
		}
	});
