import { redirect } from "next/navigation"
import { getUserSessionServer } from "@/actions/auth/getUserSessionServer"
import AdminSidebar from "@/components/platform/admin/AdminSidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getUserSessionServer()

  if (!session || session.role !== "admin") {
    redirect("/no-access")
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 bg-background">
        {children}
      </main>
    </div>
  )
}
