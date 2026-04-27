import { FileUp } from "lucide-react";
import { cn } from "~/utils/cn";

type Props = {
  preview: string | undefined;
  overlay?: React.ReactNode;
  previewClassName?: string;
} & React.ComponentPropsWithRef<"input">;

function Preview({
  url,
  alt,
  className,
}: {
  url: string | undefined;
  alt: string;
  className?: string;
}) {
  if (!url) return <FileUp className="size-8 text-muted-foreground" />;
  return <img src={url} alt={alt} className={cn("w-full h-full object-contain", className)} />;
}

export function InputFile({ preview, alt, overlay, previewClassName, ...props }: Props) {
  if (!alt) throw new Error("alt is required");
  return (
    <div
      className={cn(
        "group/input-file relative w-35 h-40 bg-muted border border-input border-dashed rounded-sm grid place-items-center overflow-hidden focus-within:border-primary",
      )}
    >
      <Preview url={preview} alt={alt} className={previewClassName} />
      {overlay ? (
        <div className="pointer-events-none absolute inset-0 rounded-sm">{overlay}</div>
      ) : null}
      <input type="file" className="absolute inset-0 opacity-0" {...props} />
    </div>
  );
}
