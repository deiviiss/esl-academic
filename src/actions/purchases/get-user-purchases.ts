'use server'

import { getUserPurchases } from '@/lib/access'

export const getUserPurchasesAction = async (userId: string) => {
  try {
    const purchases = await getUserPurchases(userId)

    return {
      ok: true,
      purchases
    }
  } catch (error) {
    console.error('Error getting user purchases:', error)
    return {
      ok: false,
      message: 'Error fetching purchases',
      purchases: []
    }
  }
}