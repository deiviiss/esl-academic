import HeaderClient from "./HeaderClient"
import { getUserSessionServer } from "@/actions/auth/getUserSessionServer"
import { userHasCourse } from "@/lib/access"

export default async function HeaderServer() {
  const session = await getUserSessionServer()
  const user = session || null

  const hasCourse = user ? await userHasCourse(user.id) : false
  const isAdmin = user?.role === "admin"

  return <HeaderClient hasCourse={hasCourse} isAdmin={isAdmin} />
}