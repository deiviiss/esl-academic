import { redirect } from 'next/navigation'
import { getUserSessionServer } from '@/actions/auth/getUserSessionServer'
import { hasAccess } from '@/lib/access'

export default async function CourseLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const userSession = await getUserSessionServer()

  if (!userSession) {
    redirect('/')
  }

  // Verificar acceso a curso
  const hasCourseAccess = await hasAccess(userSession.id, 'course')

  if (!hasCourseAccess) {
    redirect('/no-access')
  }

  return (
    <>
      {children}
    </>
  )
}