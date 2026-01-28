'use server'

import prisma from '@/lib/prisma'

/**
 * Fetches all children associated with a specific user.
 */
export const getUserChildren = async (userId: string) => {
  try {
    // const userChildren = await prisma.parentChild.findMany({
    //   where: {
    //     userId: userId
    //   },
    //   include: {
    //     child: {
    //       include: {
    //         level: true
    //       }
    //     }
    //   }
    // })

    // return userChildren.map(pc => pc.child)

    // 🟢 MOCK DATA
    return [
      {
        id: 'child-1',
        name: 'Armin',
        levelId: 'level-1',
        level: {
          id: 'level-1',
          name: 'Nursery'
        }
      },
      {
        id: 'child-2',
        name: 'Sofía',
        levelId: 'level-2',
        level: {
          id: 'level-2',
          name: 'PreK'
        }
      }
    ]
  } catch (error) {
    console.error('Error fetching user children:', error)
    return []
  }
}
