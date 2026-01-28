'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { updateUser } from '@/actions/users/update-user'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { titleFont } from '@/config/fonts'
import { type User } from '@/interfaces/user.interface'
import { noticeFailure, noticeSuccess } from '@/components/toast-notifications/ToastNotifications'

const formUserSchema = z.object({
  id: z
    .string()
    .uuid(),
  name: z
    .string()
    .min(3, { message: 'The name must have at least 3 characters' })
    .max(255, { message: 'The name must have less than 255 characters' }),
  email: z
    .string()
    .email({ message: 'The email is not valid' }),
  phoneNumber: z
    .string()
    .min(10, { message: 'The phone number must be 10 characters without the country ' })
    .max(10, { message: 'The phone number must be 14 characters long including the country code' }),
  password: z
    .string()
    .refine(value => value === '' || (value.length >= 6 && value.length <= 10), {
      message: 'The password must be between 6 and 10 characters if it will be changed'
    }),
  role: z.enum(["admin", "user"]).optional(),
  isActive: z.boolean().optional()
})

interface Props {
  user: User
}

export const UserForm = ({ user }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValuesForm = {
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    password: '',
    role: user.role as "admin" | "user" | undefined,
    isActive: user.isActive
  }

  const form = useForm<z.infer<typeof formUserSchema>>({
    resolver: zodResolver(formUserSchema),
    defaultValues: defaultValuesForm
  })

  const onSubmit = async (values: z.infer<typeof formUserSchema>) => {
    setIsSubmitting(true)

    const { ok, message } = await updateUser(values)
    if (!ok) {
      noticeFailure(message)

      setIsSubmitting(false)
      return
    }

    setIsSubmitting(false)

    noticeSuccess(message)

    const redirectTo = searchParams.get('redirectTo')
    const isProfile = redirectTo === '/platform/profile'

    if (isProfile) {
      router.replace('/platform/profile')
      return
    }

    router.replace('/platform/admin/users')
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <Card className='max-w-sm mx-auto'>
            <CardHeader>
              <h1 className={`${titleFont.className} text-2xl mb-3`}>Edit Profile</h1>
              <p>Update your information</p>
            </CardHeader>

            <CardContent className='space-y-3'>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        className='focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-200'
                        type='text'
                        {...field}
                      />
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
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input
                        className='focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-200'
                        type='text'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include country code
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E mail</FormLabel>
                    <FormControl>
                      <Input
                        className='focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-200'
                        type='email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        className='focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-200'
                        type='password'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      If you want to change your password, please enter a new one. Otherwise, leave it blank.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                      <FormDescription>
                        Is this user account active?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className='flex gap-2 w-full text-center justify-end mb-10'>
                <Button
                  size="sm"
                  type='button'
                  onClick={() => { router.back() }}
                  variant='destructive'
                >
                  Cancel
                </Button>

                <Button
                  size='sm'
                  type="submit"
                  disabled={isSubmitting}
                >
                  Save
                </Button>
              </div>

            </CardContent>
          </Card>
        </form>
      </Form>
    </>
  )
}
