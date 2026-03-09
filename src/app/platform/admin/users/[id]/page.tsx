import { getAllLevels } from "@/actions/levels/level.actions"
import UserDetail from "@/components/platform/admin/users/UserDetail"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // We need to fetch the user with children, getUserById doesn't have it
  // Let's use prisma directly here or create a new action if needed, 
  // but for a detail page prisma in a server component is fine if we don't have a specific action.

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      isActive: true,
      role: true,
      children: {
        include: {
          child: {
            include: {
              level: true
            }
          }
        }
      },
      purchase: {
        include: {
          product: true
        }
      }
    }
  })

  if (!user) {
    notFound()
  }

  const levels = await getAllLevels()

  return (
    <div className="container px-4 md:px-8 py-8 md:py-12 mx-auto">
      <UserDetail user={user} levels={levels} />
    </div>
  )
}
