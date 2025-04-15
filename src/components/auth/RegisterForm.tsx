'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoInformationOutline } from 'react-icons/io5'
import { z } from 'zod'
import { login } from '@/actions/auth/login'
import { registerUser } from '@/actions/auth/register'
import { noticeFailure, noticeSuccess } from '@/components/toast-notifications/ToastNotifications'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { titleFont } from '@/config/fonts'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'

const registerSchema = z.object({
  name: z.string().min(3, { message: 'Name is required' }).max(255, { message: 'Name must be less than 255 characters' }),
  email: z.string().email({
    message: 'The email address is not valid'
  }),
  phoneNumber: z
    .string()
    .min(10, {
      message: 'The phone number must be 10 characters without the country code'
    })
    .max(10, {
      message: 'The phone number must be 10 characters without the country code'
    }),
  password: z
    .string()
    .min(6, {
      message: 'The password must be at least 6 characters long'
    })
})

export const RegisterForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const defaultValuesForm = {
    name: '',
    email: '',
    phoneNumber: '',
    password: ''
  }

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: defaultValuesForm
  })

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsSubmitting(true)

    const data = {
      name: values.name,
      email: values.email,
      phoneNumber: values.phoneNumber,
      password: values.password
    }

    const { ok, message } = await registerUser(data)

    if (!ok) {
      noticeFailure(message)
      setError(message)
      setIsSubmitting(false)
      return
    }

    await login(data.email, data.password)
    const redirectTo = searchParams.get('redirectTo') || '/profile'

    noticeSuccess(message)
    setIsSubmitting(false)
    // window.location.replace(redirectTo)
    router.push(redirectTo)
  }

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto mt-20 mb-5"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className={`${titleFont.className} text-2xl text-center`}>Create an account</CardTitle>
              <CardDescription className='text-center' >Enter your details to create your account</CardDescription>
            </CardHeader>

            <CardContent className='space-y-3'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='name'>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Full Name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='phoneNumber'>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder='Phone Number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='email'>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='Email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='password'>Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='Password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div
                className=''
                aria-live='polite'
                aria-atomic='true'
              >
                {
                  error && (
                    <div className='flex mb-2 text-red-600 text-sm'>
                      <IoInformationOutline className='h-5 w-5' />
                      <p className=''>Invalid credentials</p>
                    </div>
                  )
                }
              </div>
            </CardContent>

            <CardFooter className='space-y-3 flex-col'>
              <Button
                type='submit'
                disabled={isSubmitting}
                className='w-full'
              >
                Create Account
              </Button>

              {/* divider line */}
              <div className="flex w-full items-center my-5">
                <div className="flex-1 border-t border-gray-500"></div>
                <span className="px-2 text-gray-600">or</span>
                <div className="flex-1 border-t border-gray-500"></div>
              </div>

              <Button
                asChild
                variant={'secondary'}
                className='w-full'>
                <Link
                  href="/auth/login"
                >
                  Login
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </form>
    </Form >
  )
}
