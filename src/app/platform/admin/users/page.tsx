import { getAllUsers } from "@/actions/users/get-all-users"
import UserList from "@/components/platform/admin/users/UserList"
import { Users as UsersIcon } from "lucide-react"

export default async function AdminUsersPage() {
  const { ok, users = [] } = await getAllUsers()

  return (
    <div className="container px-4 md:px-8 py-8 md:py-12 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center gap-3">
          <UsersIcon className="h-8 w-8" />
          Users Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage parents and their associated children records from this panel.
        </p>
      </div>

      {!ok ? (
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg border border-red-200">
          Failed to load users. Please try again later.
        </div>
      ) : (
        <UserList users={users} />
      )}
    </div>
  )
}
