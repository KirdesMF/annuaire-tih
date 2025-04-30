import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "~/utils/cn";

export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerClose = DrawerPrimitive.Close;
export const DrawerTitle = DrawerPrimitive.Title;
export const DrawerDescription = DrawerPrimitive.Description;

export function Drawer({
  shouldScaleBackground = true,
  ...props
}: React.ComponentPropsWithRef<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root {...props} shouldScaleBackground={shouldScaleBackground} />;
}

export function DrawerContent({
  ref,
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-70" />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          "fixed inset-x-0 bottom-0 outline-none h-fit bg-popover border-t border-border rounded-t-md py-4 z-70",
          className,
        )}
        {...props}
      >
        {children}
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  );
}
