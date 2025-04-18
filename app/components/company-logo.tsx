import type { Company } from "~/db/schema/companies";
import { StoreIcon } from "./icons/store";
import { cn } from "~/utils/cn";

const SIZES = {
	sm: "size-8",
	md: "size-12",
	lg: "size-16",
};

export function CompanyLogo({
	url,
	name,
	size = "sm",
}: { url?: string; name: string; size?: keyof typeof SIZES }) {
	if (!url) return <StoreIcon className={cn(SIZES[size])} />;

	return <img src={url} alt={name} className={cn(SIZES[size], "aspect-square rounded-sm")} />;
}
