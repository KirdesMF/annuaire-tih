import { cn } from "~/utils/cn";

type Props = React.ComponentPropsWithRef<"input">;

export function Input({ className, ...props }: Props) {
  return (
    <input
      className={cn(
        "border border-input rounded-sm p-2 h-9 w-full text-sm",
        "placeholder:text-sm autofill:!bg-transparent",
        className,
      )}
      {...props}
    />
  );
}
