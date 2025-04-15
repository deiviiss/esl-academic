'use server'

import { auth } from '@/auth'

export const getUserSessionServer = async () => {
  const session = await auth()

  return session?.user
}
