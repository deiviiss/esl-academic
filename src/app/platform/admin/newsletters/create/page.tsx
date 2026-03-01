import NewsletterForm from "@/components/platform/admin/newsletters/NewsletterForm"
import { getAllLevels } from "@/actions/levels/level.actions"
import { getUserSessionServer } from "@/actions/auth/getUserSessionServer"
import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Crear Newsletter | Admin",
  description: "Crea una nueva newsletter.",
}

export default async function CreateNewsletterPage() {
  const session = await getUserSessionServer()

  if (!session || session.role !== "admin") {
    redirect("/no-access")
  }

  const levels = await getAllLevels()

  return <NewsletterForm levels={levels} />
}
