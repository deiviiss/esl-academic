import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export default async function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  if (session?.user) {
    redirect('/')
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      {children}
    </div>
  )
}
