import { cn } from "~/utils/cn";

type Props = React.ComponentPropsWithRef<"label">;

export function Label({ className, ...props }: Props) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
    <label className={cn("text-sm font-light", className)} {...props} />
  );
}
