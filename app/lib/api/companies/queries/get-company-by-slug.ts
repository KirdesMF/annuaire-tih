import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { getDb } from "~/db";
import { categoriesTable } from "~/db/schema/categories";
import { companiesTable } from "~/db/schema/companies";
import { companyCategoriesTable } from "~/db/schema/company-categories";
import { getCurrentUser, isAdminRole } from "~/lib/auth/permissions.server";

export const getCompanyBySlug = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const db = getDb();

    return await db.transaction(async (tx) => {
      const company = await tx
        .select()
        .from(companiesTable)
        .where(eq(companiesTable.slug, slug))
        .then((res) => res[0]);

      if (!company) {
        throw new Error("Company not found");
      }

      if (company.status !== "active") {
        const user = await getCurrentUser();
        if (!user || (company.user_id !== user.id && !isAdminRole(user.role))) {
          throw new Error("Company not found");
        }
      }

      const categories = await tx
        .select()
        .from(companyCategoriesTable)
        .leftJoin(categoriesTable, eq(categoriesTable.id, companyCategoriesTable.category_id))
        .where(eq(companyCategoriesTable.company_id, company.id));

      return {
        ...company,
        categories: categories.map((c) => c.categories),
      };
    });
  });

export const companyBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["company", slug],
    queryFn: () => getCompanyBySlug({ data: slug }),
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
  });
