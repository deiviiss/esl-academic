'use server'

import { validateUserAdmin } from '@/actions/auth/validate-user-admin'
import { assignProductToUser } from '@/lib/access'

interface AssignProductData {
  userId: string
  productId: string
}

export const assignProductToUserAction = async (data: AssignProductData) => {
  try {
    const isAdmin = await validateUserAdmin()

    if (!isAdmin) {
      return {
        ok: false,
        message: 'You must be authenticated as an administrator'
      }
    }

    return await assignProductToUser(data.userId, data.productId)
  } catch (error) {
    console.error('Error assigning product to user:', error)
    return {
      ok: false,
      message: 'Error assigning product'
    }
  }
}