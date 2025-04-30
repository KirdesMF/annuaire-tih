import { Copy } from "lucide-react";
import { useToast } from "./ui/toast";

type CopyButtonProps = React.ComponentPropsWithRef<"button">;

export function CopyButton({ children, ...props }: CopyButtonProps) {
  const { toast } = useToast();
  function onCopy() {
    if (typeof children === "string") {
      navigator.clipboard.writeText(children);
    }
    toast({
      description: "Copié dans le presse-papiers",
      button: { label: "Fermer" },
    });
  }

  return (
    <button
      type="button"
      className="text-xs px-2 py-1 rounded-sm border border-border flex items-center gap-1.5 cursor-pointer"
      onClick={onCopy}
      {...props}
    >
      {children}
      <Copy className="size-4" />
    </button>
  );
}
