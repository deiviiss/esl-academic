'use server'

import prisma from '@/lib/prisma'

export const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: 'user' // We only want to manage parents/users, not other admins (though could be changed)
      },
      include: {
        children: {
          include: {
            child: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return {
      ok: true,
      users: users.map(user => ({
        ...user,
        childrenCount: user.children.length
      }))
    }
  } catch (error) {
    console.error('Error fetching all users:', error)
    return {
      ok: false,
      message: 'Error fetching users'
    }
  }
}
