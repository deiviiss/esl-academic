import NewsletterAdminList from "@/components/platform/admin/newsletters/NewsletterAdminList"
import { getAllNewsletters } from "@/actions/newsletters/newsletter.actions"
import { getUserSessionServer } from "@/actions/auth/getUserSessionServer"
import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gestión de Newsletters | Admin",
  description: "Administra las newsletters de la plataforma.",
}

export default async function AdminNewslettersPage() {
  const session = await getUserSessionServer()

  if (!session || session.role !== "admin") {
    redirect("/no-access")
  }

  const newsletters = await getAllNewsletters()

  return <NewsletterAdminList newsletters={newsletters} />
}
