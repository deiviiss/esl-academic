import HeaderClient from "./HeaderClient"
import { getUserSessionServer } from "@/actions/auth/getUserSessionServer"
import { userHasAcademy, userHasCourse } from "@/lib/access"

export default async function HeaderServer() {
  const session = await getUserSessionServer()
  const user = session || null

  const hasAcademy = user ? await userHasAcademy(user.id) : false
  const hasCourse = user ? await userHasCourse(user.id) : false

  return <HeaderClient hasAcademy={hasAcademy} hasCourse={hasCourse} />
}