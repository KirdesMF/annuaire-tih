import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "~/utils/cn";

export function DialogContent({
  children,
  className,
  ...props
}: React.ComponentPropsWithRef<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-70" />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm w-[min(90vw,400px)] z-70",
          "bg-popover border border-border",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close aria-label="Fermer" className="absolute top-3 end-3 ">
          <X className="size-5" />
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
