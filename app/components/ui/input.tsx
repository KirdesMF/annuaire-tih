import { cn } from "~/utils/cn";

type Props = React.ComponentPropsWithRef<"input">;

export function Input({ className, ...props }: Props) {
  return (
    <input
      className={cn(
        "ring-1 ring-input/50 rounded-sm py-1 ps-2 pe-2 h-9 w-full text-sm bg-transparent shadow-2xs text-foreground",
        "placeholder:text-xs focus-visible:outline-primary focus-visible:outline-2",
        className,
      )}
      {...props}
    />
  );
}
