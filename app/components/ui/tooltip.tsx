import { Tooltip as TooltipPrimitive } from "radix-ui";

type TooltipProps = {
  children: React.ReactNode;
  content: string;
  open?: boolean;
  onOpenChange?: () => void;
  defaultOpen?: boolean;
} & TooltipPrimitive.TooltipContentProps;

export function Tooltip({ children, open, defaultOpen, onOpenChange, ...props }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        disableHoverableContent
      >
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content align="center" {...props}>
          {props.content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
