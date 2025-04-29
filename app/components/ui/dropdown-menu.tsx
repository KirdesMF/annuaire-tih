import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { cn } from "~/utils/cn";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuLabel = DropdownMenuPrimitive.Label;
export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
export const DropdownMenuItemIndicator = DropdownMenuPrimitive.ItemIndicator;

export function DropdownMenuContent({
  children,
  ref,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        className={cn(
          "bg-white border rounded-sm border-gray-200 overflow-hidden p-1 shadow-xs dark:bg-gray-900 dark:border-gray-400 z-60",
          className,
        )}
        {...props}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({
  children,
  ref,
  className,
  ...props
}: React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.Item>) {
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        "w-full text-xs px-2 py-1.5 outline-none cursor-pointer flex items-center gap-2 data-highlighted:bg-gray-100 dark:data-highlighted:bg-gray-800",
        className,
      )}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
}

export function DropdownMenuRadioItem({
  children,
  ref,
  className,
  ...props
}: React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(
        "text-xs py-1.5 select-none outline-none data-highlighted:bg-gray-100 flex items-center dark:data-highlighted:bg-gray-800",
        className,
      )}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}
