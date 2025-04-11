import { Dialog as DialogPrimitive } from "radix-ui";
import { CloseIcon } from "../icons/close";

export function DialogContent({
	children,
	className,
	...props
}: React.ComponentPropsWithRef<typeof DialogPrimitive.Content>) {
	return (
		<DialogPrimitive.Portal>
			<DialogPrimitive.Overlay className="fixed inset-0 bg-black/40" />
			<DialogPrimitive.Content
				className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-sm p-4 w-[min(90vw,400px)] ${className}`}
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
