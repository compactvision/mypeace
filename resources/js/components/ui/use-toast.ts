import { toast as sonnerToast } from "sonner";

type ToastOptions = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function toast({ title, description, variant }: ToastOptions) {
  const message = title || description || "";
  const options = description && title ? { description } : undefined;

  if (variant === "destructive") {
    sonnerToast.error(message, options);
  } else {
    sonnerToast.success(message, options);
  }
}

export function useToast() {
  return { toast };
}
