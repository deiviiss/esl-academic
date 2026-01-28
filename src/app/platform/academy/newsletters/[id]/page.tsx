import NewsletterDetail from "@/components/platform/newsletters/NewsletterDetail"
import { getUserSessionServer } from "@/actions/auth/getUserSessionServer"
import { getNewsletterById } from "@/actions/newsletters/newsletter.actions"
import { getUserChildren } from "@/actions/users/children.actions"
import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"

type Params = Promise<{ id: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  const newsletter = await getNewsletterById(id)

  if (!newsletter) {
    return {
      title: "Newsletter Not Found",
    }
  }

  return {
    title: `${newsletter.title} | Miss Kelly ESL Academy`,
    description: `Monthly newsletter with learning materials and important information for parents.`,
  }
}

export default async function NewsletterPage({ params }: { params: Params }) {
  // Session is guaranteed by AuthLayout + AcademyLayout (route-level access control)
  const session = (await getUserSessionServer())!
  const { id } = await params
  const newsletter = await getNewsletterById(id)

  if (!newsletter) {
    notFound()
  }

  // Permission check: Parents only see newsletters for their children's levels
  if (session.role !== "admin") {
    const children = await getUserChildren(session.id)

    const hasAccess = children.some((child) =>
      newsletter.levels.some((level) => level.id === child.levelId)
    )

    if (!hasAccess) {
      redirect("/no-access")
    }
  }

  return <NewsletterDetail newsletter={newsletter} />
}
