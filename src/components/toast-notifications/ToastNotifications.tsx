import { toast } from 'sonner'

export const noticeFailure = (message: string) => {
  toast.error(message, {
    position: 'top-right',
    duration: 2000,
    className: 'bg-destructive text-white border-none',
  })
}

export const noticeSuccess = (message: string) => {
  toast.success(message, {
    position: 'top-right',
    duration: 2000,
    className: 'bg-primary text-white border-none',
  })
}

export const noticeWarning = (message: string, description?: string, action?: { label: string, onClick: () => void }) => {
  toast(message, {
    description,
    position: 'top-right',
    className: 'bg-primary text-white border-none',
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
    cancel: action ? {
      label: 'Cancel',
      onClick: () => { }
    } : undefined
  })
}
