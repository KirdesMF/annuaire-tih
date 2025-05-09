import { CheckCheckIcon, ChevronDownIcon } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import { cn } from "~/utils/cn";

export function Select({
  children,
  ref,
  placeholder,
  className,
  ...props
}: React.ComponentPropsWithRef<typeof SelectPrimitive.Root> & {
  ref?: React.Ref<HTMLButtonElement>;
  className?: string;
  placeholder: string;
}) {
  return (
    <SelectPrimitive.Root {...props}>
      <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex items-center gap-2 justify-between border border-input rounded-sm h-9 px-3 text-sm",
          "data-placeholder:text-xs data-placeholder:text-nowrap data-placeholder:truncate",
          "focus:outline-primary focus:outline-2 [&>span]:truncate",
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDownIcon className="size-4 text-muted-foreground" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={5}
          className="border border-input rounded-sm bg-popover text-popover-foreground min-w-[15ch]"
        >
          <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

export function SelectItem({
  children,
  className,
  ...props
}: React.ComponentPropsWithRef<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      {...props}
      className={cn(
        "flex items-center justify-between px-2 py-1.5 data-highlighted:bg-accent data-highlighted:text-accent-foreground text-xs outline-none",
        className,
      )}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator>
        <CheckCheckIcon className="size-4 text-muted-foreground" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}
