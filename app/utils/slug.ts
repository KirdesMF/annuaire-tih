import { customAlphabet } from "nanoid";

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 10);

export function slugify(text: string, maxLength = 50): string {
  return text
    .normalize("NFKD") // Normalize diacritics
    .toLowerCase() // Convert to lowercase
    .replace(/[^\w\s-]/g, "") // Remove non-word chars
    .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, "") // Trim hyphens
    .slice(0, maxLength) // Limit length
    .replace(/-+$/g, ""); // Trim again after slice
}

export function generateUniqueSlug(name: string) {
  const slug = slugify(name);
  return `${slug}-${nanoid()}`;
}
