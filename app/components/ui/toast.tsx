import { CircleCheck, CircleX, Info, TriangleAlert } from "lucide-react";
import { toast as sonnerToast } from "sonner";
import { cn } from "~/utils/cn";

type ToastProps = {
  id: string | number;
  title?: string;
  description: string | React.ReactNode;
  button?: { label: string | React.ReactNode; onClick?: () => void };
  status?: "success" | "error" | "warning" | "info";
};

const STATUS_ICONS = {
  success: CircleCheck,
  error: CircleX,
  warning: TriangleAlert,
  info: Info,
};

function Toast({ id, title, description, button, status = "info" }: ToastProps) {
  const Icon = STATUS_ICONS[status];

  return (
    <div className="bg-popover text-popover-foreground shadow-sm rounded-md p-4 border border-border flex items-center gap-4">
      <div className="flex items-center gap-1">
        <Icon
          className={cn(
            "size-5",
            status === "success" && "text-success",
            status === "error" && "text-error",
            status === "warning" && "text-warning",
            status === "info" && "text-info",
          )}
        />
        <div className="flex flex-col">
          {title && <p className="text-sm font-medium">{title}</p>}
          <p className="text-xs text-muted-foreground text-nowrap">{description}</p>
        </div>
      </div>

      {button && (
        <div className="shrink-0">
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground border border-muted-foreground rounded-sm px-2 py-1"
            onClick={() => {
              button.onClick?.();
              sonnerToast.dismiss(id);
            }}
          >
            {button.label}
          </button>
        </div>
      )}
    </div>
  );
}

export function useToast() {
  return {
    toast: (toast: Omit<ToastProps, "id">) =>
      sonnerToast.custom((id) => (
        <Toast
          id={id}
          title={toast.title}
          description={toast.description}
          button={toast.button}
          status={toast.status}
        />
      )),
  };
}
