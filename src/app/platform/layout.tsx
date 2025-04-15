import { redirect } from 'next/navigation'
import Header from '@/components/platform/Header'
import { getUserSessionServer } from '@/actions/auth/getUserSessionServer'

export default async function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const userSession = await getUserSessionServer()

  if (!userSession) {
    redirect('/')
  }

  return (
    <>
      <Header />
      <div className='container py-10'>
        {children}
      </div>
    </>
  )
}
