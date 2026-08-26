'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import * as SelectPrimitive from '@radix-ui/react-select'
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
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { addChild, updateChild } from '@/actions/users/manage-children'
import { noticeSuccess, noticeFailure } from '@/components/toast-notifications/ToastNotifications'
import { Loader2 } from 'lucide-react'

const childSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  levelId: z.string().min(1, 'Please select a level'),
})

type ChildFormValues = z.infer<typeof childSchema>

interface Level {
  id: string
  name: string
}

interface ChildFormProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  levels: Level[]
  child?: {
    id: string
    name: string
    levelId: string
  }
}

export default function ChildForm({ isOpen, onClose, userId, levels, child }: ChildFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const form = useForm<ChildFormValues>({
    resolver: zodResolver(childSchema),
    defaultValues: {
      name: '',
      levelId: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (child) {
        form.reset({
          name: child.name,
          levelId: child.levelId,
        })
      } else {
        form.reset({
          name: '',
          levelId: '',
        })
      }
    }
  }, [child, isOpen, form])

  const onSubmit = async (values: ChildFormValues) => {
    setIsSubmitting(true)
    let result

    if (child) {
      result = await updateChild(child.id, values.name, values.levelId, userId)
    } else {
      result = await addChild(userId, values.name, values.levelId)
    }

    if (result.ok) {
      noticeSuccess(child ? 'Child updated' : 'Child added')
      onClose()
      form.reset()
    } else {
      noticeFailure(result.message || 'Error saving child')
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent ref={containerRef} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{child ? 'Edit Child' : 'Add Child'}</DialogTitle>
          <DialogDescription>
            {child ? 'Update the child information below.' : 'Add a new child to this parent account.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Child Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter child's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="levelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an academic level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectPrimitive.Portal container={containerRef.current}>
                      <SelectPrimitive.Content
                        className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                        position="popper"
                      >
                        <SelectPrimitive.Viewport className="p-1 w-full min-w-[var(--radix-select-trigger-width)]">
                          {levels.map((level) => (
                            <SelectItem key={level.id} value={level.id}>
                              {level.name}
                            </SelectItem>
                          ))}
                        </SelectPrimitive.Viewport>
                      </SelectPrimitive.Content>
                    </SelectPrimitive.Portal>
                  </Select>
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
                {child ? 'Save Changes' : 'Add Child'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
