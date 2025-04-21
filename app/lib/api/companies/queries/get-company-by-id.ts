import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { categoriesTable } from "~/db/schema/categories";
import { companiesTable } from "~/db/schema/companies";
import { companyCategoriesTable } from "~/db/schema/company-categories";

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

export const companyByIdQuery = (id: string) =>
	queryOptions({
		queryKey: ["company", id],
		queryFn: () => getCompanyById({ data: id }),
	});
