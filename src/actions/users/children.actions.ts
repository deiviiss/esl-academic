'use server'

import prisma from '@/lib/prisma'

/**
 * Fetches all children associated with a specific user.
 */
export const getUserChildren = async (userId: string) => {
  try {
    const userChildren = await prisma.parentChild.findMany({
      where: {
        userId: userId
      },
      include: {
        child: {
          include: {
            level: true
          }
        }
      }
    })

    return userChildren.map(pc => pc.child)
  } catch (error) {
    console.error('Error fetching user children:', error)
    return []
  }
}
