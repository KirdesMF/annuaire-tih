import { clsx, type ClassArray } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...classes: ClassArray) {
  return twMerge(clsx(classes));
}
