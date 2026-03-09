'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { updateUser } from '@/actions/users/update-user'
import { noticeSuccess, noticeFailure } from '@/components/toast-notifications/ToastNotifications'
import { Loader2 } from 'lucide-react'

const parentSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().length(10, 'Phone number must be 10 digits'),
})

type ParentFormValues = z.infer<typeof parentSchema>

interface ParentFormProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: string
    name: string
    email: string
    phoneNumber: string
  }
}

export default function ParentForm({ isOpen, onClose, user }: ParentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ParentFormValues>({
    resolver: zodResolver(parentSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
  })

  const onSubmit = async (values: ParentFormValues) => {
    setIsSubmitting(true)
    const result = await updateUser({
      id: user.id,
      ...values,
    })

    if (result.ok) {
      noticeSuccess('Parent information updated successfully')
      onClose()
    } else {
      noticeFailure(result.message || 'Error updating parent information')
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Parent Information</DialogTitle>
          <DialogDescription>
            Update the contact details for this parent account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter parent's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter 10-digit phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4 gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
