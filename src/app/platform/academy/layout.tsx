import { redirect } from 'next/navigation'
import { getUserSessionServer } from '@/actions/auth/getUserSessionServer'
import { userHasAcademy } from '@/lib/access'

export default async function AcademyLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getUserSessionServer()
  if (!session) return redirect("/")
  const userId = session.id

  const hasAcademy = await userHasAcademy(userId)
  if (!hasAcademy && session.role !== "admin") {
    return redirect("/no-access")
  }

  return <>{children}</>
}