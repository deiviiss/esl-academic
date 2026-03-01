import LevelsAdmin from "@/components/platform/admin/levels/LevelsAdmin"
import { getAllLevels } from "@/actions/levels/level.actions"
import { getUserSessionServer } from "@/actions/auth/getUserSessionServer"
import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Levels Management | Admin",
  description: "Manage academic levels within the academy.",
}

export default async function AdminLevelsPage() {
  const session = await getUserSessionServer()

  if (!session || session.role !== "admin") {
    redirect("/no-access")
  }

  const levels = await getAllLevels()

  return <LevelsAdmin levels={levels} />
}
