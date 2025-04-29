import { cn } from "~/utils/cn";

type Props = React.ComponentPropsWithRef<"input">;

export function Input({ className, ...props }: Props) {
  return (
    <input
      className={cn(
        "border border-gray-300 dark:border-gray-700 rounded-sm p-2 h-11 w-full text-sm",
        "placeholder:text-sm",
        className,
      )}
      {...props}
    />
  );
}
