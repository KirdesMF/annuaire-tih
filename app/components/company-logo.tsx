import type { Company } from "~/db/schema/companies";
import { StoreIcon } from "./icons/store";
import { cn } from "~/utils/cn";

const SIZES = {
	sm: "size-8",
	md: "size-12",
	lg: "size-16",
};

export function CompanyLogo({
	company,
	size = "sm",
}: { company: Partial<Company>; size?: keyof typeof SIZES }) {
	if (!company.logo) return <StoreIcon className={cn(SIZES[size])} />;

	return (
		<img
			src={company.logo.secureUrl}
			alt={company.name}
			className={cn(SIZES[size], "aspect-square rounded-sm")}
		/>
	);
}
