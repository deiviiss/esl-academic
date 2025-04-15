'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoInformationOutline } from 'react-icons/io5'
import { z } from 'zod'
import { login } from '@/actions/auth/login'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { titleFont } from '@/config/fonts'
import { noticeFailure, noticeSuccess } from '@/components/toast-notifications/ToastNotifications'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'

const loginSchema = z.object({
  email: z.string({
    required_error: 'El correo electrónico es requerido',
    message: 'Correo electrónico no válido'
  }).email({
    message: 'Correo electrónico no válido'
  }),
  password: z.string({
    required_error: 'La contraseña es requerida',
    message: 'Contraseña no válida'
  }).min(6, {
    message: 'La contraseña debe tener al menos 6 caracteres'
  })
})

export const LoginForm = () => {
  const searchParams = useSearchParams()

  const redirectTo = searchParams.get('redirectTo') || '/platform/profile'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const defaultValuesForm = {
    email: '',
    password: ''
  }

  const form = useForm<z.infer<typeof loginSchema>>({
    defaultValues: defaultValuesForm,
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true)

    const { email, password } = values

    const { ok, message } = await login(email, password)

    if (!ok) {
      noticeFailure(message)
      setError(message)
      setIsSubmitting(false)
      return
    }

    noticeSuccess(message)
    setIsSubmitting(false)
    // router.push(redirectTo)
    window.location.replace(redirectTo)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className={`${titleFont.className} text-2xl text-center`}>Welcome back</CardTitle>
              <CardDescription className="text-center">
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>

            <CardContent className='grid gap-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='m.kelly@example.com' {...field} value={field.value} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='Contraseña' {...field} value={field.value} />
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
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>

              {/* divisor l ine */}
              <div className="flex w-full items-center my-5">
                <div className="flex-1 border-t border-gray-500"></div>
                <span className="px-2 text-gray-600">0</span>
                <div className="flex-1 border-t border-gray-500"></div>
              </div>

              <Button
                asChild
                variant={'secondary'}
                className='w-full'>
                <Link
                  href={`/auth/new-account?redirectTo=${redirectTo}`}
                >
                  Create an new account
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </form>
    </Form>
  )
}
