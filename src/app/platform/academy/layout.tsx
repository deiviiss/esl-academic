import { redirect } from 'next/navigation'
import { getUserSessionServer } from '@/actions/auth/getUserSessionServer'
import { hasAccess } from '@/lib/access'

export default async function AcademyLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const userSession = await getUserSessionServer()

  if (!userSession) {
    redirect('/')
  }

  // Verify access to academy
  const hasAcademyAccess = await hasAccess(userSession.id, 'academy')

  if (!hasAcademyAccess) {
    redirect('/no-access')
  }

  return (
    <>
      {children}
    </>
  )
}