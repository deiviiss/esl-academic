import NewsletterList from "@/components/platform/newsletters/NewsletterList"
import { getUserSessionServer } from "@/actions/auth/getUserSessionServer"
import { userHasAcademy } from "@/lib/access"
import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Newsletters | Miss Kelly ESL Academy",
  description: "Browse our monthly newsletters for different academic levels.",
}

// Simulación de obtención de datos
const getNewslettersByLevel = () => {
  // En una aplicación real, esto vendría de una API o base de datos
  return {
    toddlers: [
      { id: "n1", title: "April 2025 Newsletter", month: "2025-04-01" },
      { id: "n2", title: "May 2025 Newsletter", month: "2025-05-01" },
      { id: "n5", title: "March 2025 Newsletter", month: "2025-03-01" },
      { id: "n6", title: "February 2025 Newsletter", month: "2025-02-01" },
    ],
    nursery: [
      { id: "n3", title: "April 2025 Newsletter", month: "2025-04-01" },
      { id: "n7", title: "March 2025 Newsletter", month: "2025-03-01" },
      { id: "n8", title: "February 2025 Newsletter", month: "2025-02-01" },
      { id: "n9", title: "January 2025 Newsletter", month: "2025-01-01" },
    ],
    prek: [
      { id: "n4", title: "May 2025 Newsletter", month: "2025-05-01" },
      { id: "n10", title: "April 2025 Newsletter", month: "2025-04-01" },
      { id: "n11", title: "March 2025 Newsletter", month: "2025-03-01" },
      { id: "n12", title: "February 2025 Newsletter", month: "2025-02-01" },
    ],
  }
}

export default async function NewslettersPage() {
  const session = await getUserSessionServer()
  if (!session) redirect("/")

  const userId = session.id
  const isAdmin = session.role === "admin"

  const hasAcademy = await userHasAcademy(userId)
  if (!hasAcademy && !isAdmin) redirect("/no-access")

  const allowedLevels = isAdmin ? ["toddlers", "nursery", "prek"] : ((session).level ? [(session).level] : [])

  const newslettersByLevel = getNewslettersByLevel()

  return <NewsletterList newslettersByLevel={newslettersByLevel} allowedLevels={allowedLevels} />
}
