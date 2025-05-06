import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "~/db";
import { categoriesTable } from "~/db/schema/categories";
import { companiesTable } from "~/db/schema/companies";
import { companyCategoriesTable } from "~/db/schema/company-categories";

export const getUserCompanies = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async ({ data }) => {
    // Get companies
    const companiesQuery = await db
      .select({
        id: companiesTable.id,
        name: companiesTable.name,
        description: companiesTable.description,
        status: companiesTable.status,
        siret: companiesTable.siret,
        business_owner: companiesTable.business_owner,
        website: companiesTable.website,
        service_area: companiesTable.service_area,
        subdomain: companiesTable.subdomain,
        email: companiesTable.email,
        phone: companiesTable.phone,
        work_mode: companiesTable.work_mode,
        rqth: companiesTable.rqth,
        logo: companiesTable.logo,
        gallery: companiesTable.gallery,
        slug: companiesTable.slug,
      })
      .from(companiesTable)
      .where(eq(companiesTable.user_id, data))
      .orderBy(desc(companiesTable.created_at));

    // Then get categories in a separate query
    const categories = await db
      .select({
        company_id: companyCategoriesTable.company_id,
        category_id: categoriesTable.id,
        category_name: categoriesTable.name,
      })
      .from(companyCategoriesTable)
      .leftJoin(categoriesTable, eq(categoriesTable.id, companyCategoriesTable.category_id))
      .where(
        inArray(
          companyCategoriesTable.company_id,
          companiesQuery.map((c) => c.id),
        ),
      );

    return companiesQuery.map((company) => ({
      ...company,
      categories: categories.filter((c) => c.company_id === company.id),
    }));
  });

export function userCompaniesQuery(userId: string) {
  return queryOptions({
    queryKey: ["user", "companies", userId],
    queryFn: () => getUserCompanies({ data: userId }),
    staleTime: 1000 * 60 * 60 * 24,
  });
}
