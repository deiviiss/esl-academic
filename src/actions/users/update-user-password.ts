'use server'

import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getUserSessionServer } from '../auth/getUserSessionServer'
import { getUserById } from './get-user-by-id'

const passwordSchema = z.object({
  id: z
    .string()
    .uuid(),
  currentPassword: z
    .string()
    .min(6, { message: 'Current password is required' }),
  newPassword: z
    .string()
    .min(6, { message: 'The new password must have at least 6 characters' })
    .max(10, { message: 'The new password must be less than 10 characters' })
})


interface IData {
  id: string
  currentPassword: string
  newPassword: string
}

export const updateUserPassword = async (data: IData) => {
  const passwordUserParsed = passwordSchema.safeParse(data)

  if (!passwordUserParsed.success) {
    return {
      ok: false,
      message: 'Error updating user'
    }
  }

  const { currentPassword, newPassword, id } = passwordUserParsed.data


  try {
    const userSession = await getUserSessionServer()

    if (!userSession) {
      return {
        ok: false,
        message: 'Session not found'
      }
    }

    const { user } = await getUserById(userSession.id)

    if (!user) {
      return {
        ok: false,
        message: 'User not found'
      }
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
      return {
        ok: false,
        message: 'Current password is incorrect'
      }
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    const dataUserUpdated = {
      password: hashedNewPassword
    }

    const userUpdated = await prisma.user.update({
      where: { id },
      data: dataUserUpdated
    })

    if (!userUpdated) {
      return {
        ok: false,
        message: 'User not updated'
      }
    }

    revalidatePath('/platform/profile')

    return {
      ok: true,
      message: 'Updated successfully'
    }
  } catch (error) {
    console.error('Error updating user', error)
    return {
      ok: false,
      message: 'Error updating user, please contact support'
    }
  }
}
