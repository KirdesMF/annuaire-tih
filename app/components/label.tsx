import type { LabelHTMLAttributes } from "react";
import { cn } from "~/utils/cn";

type Props = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, children, ...props }: Props) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
    <label {...props} className={cn("text-sm font-light text-gray-700", className)}>
      {children}
    </label>
  );
}
