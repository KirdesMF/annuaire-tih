import { cn } from "~/utils/cn";
import { StoreIcon } from "./icons/store";

const SIZES = {
  sm: "w-8 h-auto",
  md: "w-12 h-auto",
  lg: "w-32 h-auto",
};

export function CompanyLogo({
  url,
  name,
  size = "sm",
}: { url?: string; name: string; size?: keyof typeof SIZES }) {
  if (!url) return <StoreIcon className="size-full" />;

  return <img src={url} alt={name} className={cn("rounded-sm object-contain size-full")} />;
}
