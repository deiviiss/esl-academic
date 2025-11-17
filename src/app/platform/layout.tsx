import { redirect } from 'next/navigation'
import HeaderServer from '@/components/platform/HeaderServer'
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
      <HeaderServer />
      <div className='container px-2 pb-10'>
        {children}
      </div>
    </>
  )
}
