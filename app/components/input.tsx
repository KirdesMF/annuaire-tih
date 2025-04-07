import type { InputHTMLAttributes } from "react";
import { cn } from "~/utils/cn";

type Props = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: Props) {
	return (
		<input
			{...props}
			className={cn("border border-gray-300 rounded-sm p-2 h-10 w-full", className)}
		/>
	);
}
