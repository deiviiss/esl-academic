import { redirect } from 'next/navigation'
import { getUserSessionServer } from '@/actions/auth/getUserSessionServer'
import { getUserById } from '@/actions/users/get-user-by-id'
import { UserForm } from '@/components/users/user-form/UserForm'

type Params = Promise<{ id: string }>

export default async function ProfilePage({ params }: { params: Params }) {
  const userSession = await getUserSessionServer()
  const { id } = await params

  if (!userSession) {
    redirect('/')
  }

  const { user } = await getUserById(id)

  if (!user) {
    redirect('/')
  }

  return (
    <UserForm user={user} />
  )
}
