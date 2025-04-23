import { Command as CommandPrimitive } from "cmdk";
import { cn } from "~/utils/cn";

export const Command = CommandPrimitive;

export function CommandLoading({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof CommandPrimitive.Loading>) {
  return <CommandPrimitive.Loading className={cn("px-4 py-2 text-sm", className)} {...props} />;
}

export function CommandSeparator({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      className={cn("my-2 h-px w-full bg-gray-400", className)}
      ref={ref}
      {...props}
    />
  );
}

export function CommandEmpty({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty className={cn("px-4 py-2 text-sm", className)} ref={ref} {...props}>
      {children}
    </CommandPrimitive.Empty>
  );
}

export function CommandInput({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof CommandPrimitive.Input>) {
  return (
    <CommandPrimitive.Input
      className={cn(
        ["w-full px-4 py-1.5 rounded-md outline-none text-sm", "placeholder:text-sm"],
        className,
      )}
      {...props}
    />
  );
}

export function CommandList({
  className,
  ref,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List ref={ref} className={cn("max-h-80 scroll-py-8", className)} {...props}>
      {children}
    </CommandPrimitive.List>
  );
}

export function CommandItem({
  className,
  ref,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      ref={ref}
      className={cn("px-4 py-2 text-sm w-full aria-selected:bg-gray-100", className)}
      {...props}
    >
      {children}
    </CommandPrimitive.Item>
  );
}
