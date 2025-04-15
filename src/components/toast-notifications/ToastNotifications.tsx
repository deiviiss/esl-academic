import { toast } from 'sonner'

export const noticeFailure = (message: string) => {
  toast.error(message, {
    position: 'top-right',
    duration: 2000,
    className: 'bg-destructive text-white',
  })
}

export const noticeSuccess = (message: string) => {
  toast.success(message, {
    position: 'top-right',
    duration: 2000,
    className: 'bg-primary text-white',
  })
}
