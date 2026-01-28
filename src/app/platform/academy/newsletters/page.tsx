import NewsletterList from "@/components/platform/newsletters/NewsletterList"
import { ChildSelector } from "@/components/platform/newsletters/ChildSelector"
import { getUserSessionServer } from "@/actions/auth/getUserSessionServer"
import { userHasAcademy } from "@/lib/access"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { getUserChildren } from "@/actions/users/children.actions"
import { getNewslettersByLevel, getAllNewsletters } from "@/actions/newsletters/newsletter.actions"

export const metadata: Metadata = {
  title: "Newsletters | Miss Kelly ESL Academy",
  description: "Browse our monthly newsletters.",
}

export default async function NewslettersPage({
  searchParams,
}: {
  searchParams: Promise<{ childId?: string }>
}) {
  // Session is guaranteed by AuthLayout + AcademyLayout (route-level access control)
  const session = (await getUserSessionServer())!

  const userId = session.id
  const isAdmin = session.role === "admin"

  const hasAcademy = await userHasAcademy(userId)
  if (!hasAcademy && !isAdmin) redirect("/no-access")

  const { childId } = await searchParams

  // Admin view: shows all newsletters without child filtering
  if (isAdmin) {
    const newsletters = await getAllNewsletters()
    return <NewsletterList newsletters={newsletters} />
  }

  const userChildren = await getUserChildren(userId)

  if (userChildren.length === 0) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4 text-primary">No enrollments found</h1>
        <p className="text-muted-foreground">It seems you don&apos;t have any children enrolled in the academy yet. Please contact Miss Kelly for assistance.</p>
      </div>
    )
  }

  const selectedChild = childId
    ? (userChildren).find((c) => c.id === childId) || userChildren[0]
    : userChildren[0]

  const newsletters = await getNewslettersByLevel((selectedChild).levelId)

  return (
    <>
      {userChildren.length > 1 && (
        <ChildSelector childrenList={userChildren} selectedChildId={(selectedChild).id} />
      )}
      <NewsletterList newsletters={newsletters} selectedChild={selectedChild} />
    </>
  )
}
