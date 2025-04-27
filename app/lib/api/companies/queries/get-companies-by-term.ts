import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, eq, sql } from "drizzle-orm";
import { getDb } from "~/db";
import { companiesTable } from "~/db/schema/companies";

export const getCompaniesByTerm = createServerFn({ method: "GET" })
  .validator((term: string) => term)
  .handler(async ({ data: term }) => {
    const searchWords = term
      .split(/\s+/)
      .filter((word) => word.length > 0)
      .map((word) => `${word}:*`); // Add :* for prefix matching

    // Join words with & for AND operation
    const tsQuery = searchWords.join(" & ");

    return await getDb()
      .select()
      .from(companiesTable)
      .where(
        and(
          sql`to_tsvector('french', ${companiesTable.name} || ' ' || ${companiesTable.subdomain} || ' ' || ${companiesTable.description}) @@ to_tsquery('french', ${tsQuery})`,
          eq(companiesTable.status, "active"),
        ),
      );
  });

export function companiesByTermQuery(term: string) {
  return queryOptions({
    queryKey: ["companies", term],
    queryFn: ({ signal }) => getCompaniesByTerm({ data: term, signal }),
    enabled: term.length >= 3,
  });
}
