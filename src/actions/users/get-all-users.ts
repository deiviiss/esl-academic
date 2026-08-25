'use server'

import prisma from '@/lib/prisma'

export const getAllUsers = async (query?: string) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: 'user', // We only want to manage parents/users, not other admins (though could be changed)
        ...(query ? {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { phoneNumber: { contains: query } }
          ]
        } : {})
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
