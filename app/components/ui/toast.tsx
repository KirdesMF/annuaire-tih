import { toast as sonnerToast } from "sonner";

type ToastProps = {
  id: string | number;
  title?: string;
  description: string | React.ReactNode;
  button: { label: string; onClick?: () => void };
};

function Toast({ id, title, description, button }: ToastProps) {
  return (
    <div className="bg-popover text-popover-foreground shadow-md rounded-md p-4 border border-border flex items-center gap-4">
      <div className="flex flex-col">
        {title && <p className="text-sm font-medium">{title}</p>}
        <p className="text-sm text-muted-foreground text-pretty">{description}</p>
      </div>

      <div className="shrink-0">
        <button
          type="button"
          className="text-xs text-muted-foreground hover:text-foreground border border-muted-foreground rounded-md px-2 py-1"
          onClick={() => {
            button.onClick?.();
            sonnerToast.dismiss(id);
          }}
        >
          {button.label}
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  return {
    toast: (toast: Omit<ToastProps, "id">) =>
      sonnerToast.custom((id) => (
        <Toast id={id} title={toast.title} description={toast.description} button={toast.button} />
      )),
  };
}
