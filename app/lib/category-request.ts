import * as v from "valibot";
import { CategorySearchSchema } from "./validator/category.schema";

function parseSearchValue(value: string | null): unknown {
  if (value === null) return null;
  try {
    // Match TanStack Router's JSON-aware query string encoding, including numeric names/IDs.
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function rejectInvalidCategoryRequest(url: URL): Response | undefined {
  const path = url.pathname.split("/");
  let section: string;
  try {
    section = decodeURIComponent(path[1] ?? "").toLowerCase();
  } catch {
    return;
  }
  if (section !== "categories" || path.length < 3) return;

  let slug: string;
  try {
    slug = decodeURIComponent(path.slice(2).join("/").replace(/\/$/, ""));
  } catch {
    slug = "";
  }

  const ids = url.searchParams.getAll("id");
  const names = url.searchParams.getAll("name");
  if (
    slug.length > 0 &&
    slug.length <= 255 &&
    !slug.includes("/") &&
    ids.length === 1 &&
    names.length === 1 &&
    v.safeParse(CategorySearchSchema, {
      id: parseSearchValue(ids[0]),
      name: parseSearchValue(names[0]),
    }).success
  ) {
    return;
  }

  return new Response("Requête de catégorie invalide.", {
    status: 400,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
