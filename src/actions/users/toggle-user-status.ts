'use server'

import { revalidatePath } from 'next/cache'
import { validateUserAdmin } from '@/actions/auth/validate-user-admin'
import prisma from '@/lib/prisma'

interface Props {
  id: string
  status: boolean
}

export const toggleUserStatus = async ({ id, status }: Props) => {
  try {
    const isAdmin = await validateUserAdmin()

    if (!isAdmin) {
      return {
        ok: false,
        message: 'You must be authenticated as an administrator'
      }
    }

    const newStatus = !status

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        isActive: newStatus
      }
    })

    if (!updatedUser) {
      return {
        ok: false,
        message: 'User not found'
      }
    }

    revalidatePath('/admin/users')

    return {
      ok: true,
      message: updatedUser.isActive ? 'User successfully activated' : 'User successfully deactivated'
    }
  } catch (error) {
    console.error('Error changing user status:', error)
    return {
      ok: false,
      message: 'Error deactivating user, please contact support'
    }
  }
}
