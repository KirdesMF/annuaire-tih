import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "~/utils/cn";
import { CloseIcon } from "../icons/close";

export function DialogContent({
  children,
  className,
  ...props
}: React.ComponentPropsWithRef<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-[1px]" />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm w-[min(90vw,400px)]",
          "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close aria-label="Fermer" className="absolute top-3 end-3 ">
          <CloseIcon className="size-5" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
export const DialogClose = DialogPrimitive.Close;
