import { useToast } from "../../../contexts/ToastContext"
import { Toast, ToastTitle, ToastDescription } from "../Toast/Toast"
import "./Toaster.css"

export function Toaster() {
  const { toasts, dismissToast } = useToast()

  return (
    <div className="toaster">
      {toasts.map(({ id, title, description, variant, action }) => (
        <Toast key={id} variant={variant} onOpenChange={() => dismissToast(id)}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
        </Toast>
      ))}
    </div>
  )
}
