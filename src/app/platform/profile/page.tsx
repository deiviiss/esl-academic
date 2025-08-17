import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUserSessionServer } from '@/actions/auth/getUserSessionServer'
import { getUserById } from '@/actions/users/get-user-by-id'
import { ProfileClient } from '@/components/platform/ProfileClient'

export const metadata: Metadata = {
  title: "Profile - Miss Kelly ESL Academy",
  description: "Manage your profile and subscription settings for Miss Kelly ESL Academy.",
}

const ProfilePage = async () => {
  const userSession = await getUserSessionServer()

  if (!userSession) {
    redirect('/')
  }

  const { user } = await getUserById(String(userSession.id))

  if (!user) {
    redirect('/')
  }

  return (
    <ProfileClient user={user} />
  )
}

export default ProfilePage
