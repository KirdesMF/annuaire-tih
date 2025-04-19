import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { db } from "~/db";
import {
	companiesTable,
	type CompanyStatus,
	type CompanyGallery,
	type Company,
} from "~/db/schema/companies";
import {
	AddCompanySchema,
	UpdateCompanySchema,
	type AddCompanyData,
} from "../validator/company.schema";
import { getWebRequest } from "@tanstack/react-start/server";
import { auth } from "~/lib/auth/auth.server";
import { redirect } from "@tanstack/react-router";
import * as v from "valibot";
import { companyCategoriesTable } from "~/db/schema/company-categories";
import { uploadImageToCloudinary, deleteCompanyFromCloudinary } from "../cloudinary";
import { decode } from "decode-formdata";
import { queryOptions } from "@tanstack/react-query";
import { categoriesTable } from "~/db/schema/categories";
import { generateUniqueSlug } from "~/utils/slug";
import { unknown } from "better-auth";

/**
 * Add a company
 * @todo: attempt to generate a unique slug
 */
export const addCompany = createServerFn({ method: "POST" })
	.validator((data: FormData) => {
		const decodedFormData = decode(data, {
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
						user_id: session.user.id,
						created_by: session.user.id,
						slug: generateUniqueSlug(rest.name),
						social_media: { facebook, instagram, linkedin, calendly },
					})
					.returning();

				// Upload logo
				// @todo: handle errors
				if (logo && logo.size > 0) {
					const res = await uploadImageToCloudinary({
						file: logo,
						companyId: company.id,
						companySlug: company.slug,
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
							companySlug: company.slug,
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

export const getCompanyById = createServerFn({ method: "GET" })
	.validator((id: string) => id)
	.handler(async ({ data: id }) => {
		try {
			const company = await db
				.select()
				.from(companiesTable)
				.where(eq(companiesTable.id, id))
				.then((res) => res[0]);

			const categories = await db
				.select()
				.from(companyCategoriesTable)
				.leftJoin(categoriesTable, eq(categoriesTable.id, companyCategoriesTable.category_id))
				.where(eq(companyCategoriesTable.company_id, company.id));

			return { ...company, categories };
		} catch (error) {
			console.error(error);
		}
	});

export const companyByIdQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["company", id],
		queryFn: () => getCompanyById({ data: id }),
	});
/**
 * Get a company by slug
 */
export const getCompanyBySlug = createServerFn({ method: "GET" })
	.validator((slug: string) => slug)
	.handler(async ({ data: slug }) => {
		try {
			const company = await db
				.select()
				.from(companiesTable)
				.where(eq(companiesTable.slug, slug))
				.limit(1)
				.then((res) => res[0]);

			const categories = await db
				.select()
				.from(companyCategoriesTable)
				.leftJoin(categoriesTable, eq(categoriesTable.id, companyCategoriesTable.category_id))
				.where(eq(companyCategoriesTable.company_id, company.id));

			return {
				...company,
				categories: categories.map((c) => c.categories),
			};
		} catch (error) {
			console.error(error);
		}
	});

export function companyBySlugQueryOptions(slug: string) {
	return queryOptions({
		queryKey: ["company", slug],
		queryFn: () => getCompanyBySlug({ data: slug }),
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

/**
 * Get all companies by category
 */
export const getAllActiveCompaniesByCategory = createServerFn({ method: "GET" })
	.validator((categoryId: string) => categoryId)
	.handler(async ({ data: categoryId }) => {
		try {
			const companies = await db
				.select()
				.from(companiesTable)
				.innerJoin(companyCategoriesTable, eq(companyCategoriesTable.company_id, companiesTable.id))
				.where(
					and(
						eq(companyCategoriesTable.category_id, categoryId),
						eq(companiesTable.status, "active"),
					),
				);

			return {
				companies: companies.map((company) => company.companies),
				categories: companies.map((company) => company.company_categories),
			};
		} catch (error) {
			console.error(error);
		}
	});

export function setAllActiveCompaniesByCategoryQueryOptions(categoryId: string) {
	return queryOptions({
		queryKey: ["companies", "category", categoryId, "active"],
		queryFn: () => getAllActiveCompaniesByCategory({ data: categoryId }),
	});
}

/**
 * Update the status of a company
 */
type UpdateCompanyStatusData = { companyId: string; status: CompanyStatus };
export const updateCompanyStatus = createServerFn({ method: "POST" })
	.validator((data: UpdateCompanyStatusData) => data)
	.handler(async ({ data: { companyId, status } }) => {
		try {
			await db.update(companiesTable).set({ status }).where(eq(companiesTable.id, companyId));
		} catch (error) {
			console.error(error);
		}
	});

/**
 * Update any field of a company
 */
export const updateCompany = createServerFn({ method: "POST" })
	.validator((data: FormData) => {
		const decodedFormData = decode(data, {
			files: ["logo", "gallery"],
			arrays: ["categories", "gallery"],
			booleans: ["rqth"],
		});
		return v.parse(UpdateCompanySchema, decodedFormData);
	})
	.handler(async ({ data }) => {
		try {
			const { logo, gallery, categories, ...rest } = data;
			await db.update(companiesTable).set(rest).where(eq(companiesTable.id, data.companyId));
		} catch (error) {
			console.error(error);
		}
	});

/**
 * Delete a company
 */
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
