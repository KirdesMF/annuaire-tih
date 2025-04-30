import { Copy } from "lucide-react";
import { toast } from "sonner";

type CopyButtonProps = React.ComponentPropsWithRef<"button">;

export function CopyButton({ children, ...props }: CopyButtonProps) {
  function onCopy() {
    if (typeof children === "string") {
      navigator.clipboard.writeText(children);
    }
    toast.success("Copié dans le presse-papiers");
  }

  return (
    <button
      type="button"
      className="text-xs px-2 py-1 rounded-sm border border-gray-300 text-gray-500 flex items-center gap-1.5 cursor-pointer"
      onClick={onCopy}
      {...props}
    >
      {children}
      <Copy className="size-4" />
    </button>
  );
}
