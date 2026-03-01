import NewsletterForm from "@/components/platform/admin/newsletters/NewsletterForm"
import { getAllLevels } from "@/actions/levels/level.actions"
import { getNewsletterById } from "@/actions/newsletters/newsletter.actions"
import { getUserSessionServer } from "@/actions/auth/getUserSessionServer"
import { redirect, notFound } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Editar Newsletter | Admin",
  description: "Edita una newsletter existente.",
}

interface EditNewsletterPageProps {
  params: Promise<{ id: string }>
}

export default async function EditNewsletterPage({ params }: EditNewsletterPageProps) {
  const session = await getUserSessionServer()

  if (!session || session.role !== "admin") {
    redirect("/no-access")
  }

  const { id } = await params
  const [newsletter, levels] = await Promise.all([
    getNewsletterById(id),
    getAllLevels()
  ])

  if (!newsletter) {
    notFound()
  }

  return <NewsletterForm newsletter={newsletter} levels={levels} />
}
