import { createServerFn } from "@tanstack/react-start";
import { getDb } from "~/db";
import { categoriesTable } from "~/db/schema/categories";
import { queryOptions } from "@tanstack/react-query";

export const getCategories = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const categories = await getDb().select().from(categoriesTable);
    return categories;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export const categoriesQueryOptions = queryOptions({
  queryKey: ["categories"],
  queryFn: () => getCategories(),
  staleTime: 1000 * 60 * 60 * 24,
});
