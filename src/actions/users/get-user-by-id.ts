'use server'

import { type User } from '@/interfaces/users/user.interface'
import prisma from '@/lib/prisma'

interface Response {
  ok: boolean
  message: string
  user?: User
}

export const getUserById = async (id: string): Promise<Response> => {
  try {
    const user = await prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phoneNumber: true,
        password: true,
        emailVerified: true,
        phoneNumberVerified: true,
        image: true,
        role: true,
        isActive: true
      }
    })

    if (!user) {
      return {
        ok: false,
        message: 'User not found'
      }
    }

    return {
      ok: true,
      message: 'User found',
      user
    }
  } catch (error) {
    console.error('Error fetching user', error)
    return {
      ok: false,
      message: 'Error fetching user, please contact support'
    }
  }
}
