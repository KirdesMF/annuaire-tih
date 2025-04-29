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
      <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 outline-none h-fit bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 rounded-t-md py-4",
          className,
        )}
        {...props}
      >
        {children}
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  );
}
