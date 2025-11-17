import { redirect } from 'next/navigation'
import { getUserSessionServer } from '@/actions/auth/getUserSessionServer'
import { userHasCourse } from '@/lib/access'

export default async function CourseLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getUserSessionServer()
  if (!session) return redirect("/")
  const userId = session.id

  const hasCourse = await userHasCourse(userId)
  if (!hasCourse && session.role !== "admin") {
    return redirect("/no-access")
  }

  return <>{children}</>
}