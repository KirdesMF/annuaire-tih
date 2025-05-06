import { FileUp } from "lucide-react";
import { cn } from "~/utils/cn";

type Props = {
  preview: string | undefined;
} & React.ComponentPropsWithRef<"input">;

function Preview({ url, alt }: { url: string | undefined; alt: string }) {
  if (!url) return <FileUp className="size-8 text-muted-foreground" />;
  return <img src={url} alt={alt} className="w-full h-full object-contain" />;
}

export function InputFile({ preview, alt, ...props }: Props) {
  if (!alt) throw new Error("alt is required");
  return (
    <div
      className={cn(
        "relative w-35 h-40 bg-muted border border-input border-dashed rounded-sm grid place-items-center focus-within:border-primary",
      )}
    >
      <Preview url={preview} alt={alt} />
      <input type="file" className="absolute inset-0 opacity-0" {...props} />
    </div>
  );
}
