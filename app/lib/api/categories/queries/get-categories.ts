import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getDb } from "~/db";
import { categoriesTable } from "~/db/schema/categories";

export const getCategories = createServerFn({
  method: "GET",
}).handler(async () => {
  const db = getDb();
  const categories = await db.select().from(categoriesTable);
  return categories;
});

export const categoriesQueryOptions = queryOptions({
  queryKey: ["categories"],
  queryFn: () => getCategories(),
  staleTime: 1000 * 60 * 60 * 24,
});
