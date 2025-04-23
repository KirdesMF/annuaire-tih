import { Popover as PopoverPrimitive } from "radix-ui";
import { cn } from "~/utils/cn";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;

type Props = React.ComponentPropsWithRef<typeof PopoverPrimitive.Content>;
export function PopoverContent({ className, children, ref, ...props }: Props) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        className={cn(
          "w-(--radix-popper-anchor-width) border border-gray-400 rounded-md shadow-sm bg-white",
          className,
        )}
        sideOffset={5}
        {...props}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}
