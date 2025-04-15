'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getUserSessionServer } from '../auth/getUserSessionServer'
import { getUserById } from './get-user-by-id'

const imageSchema = z.string().url("Invalid image URL");

export const updateUserImage = async (imageUrl: string) => {
  const imageParsed = imageSchema.safeParse(imageUrl);

  if (!imageParsed.success) {
    return { ok: false, message: "Invalid image URL" };
  }

  if (!imageParsed.success) {
    return {
      ok: false,
      message: 'Error validating image'
    }
  }

  const image = imageParsed.data

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

    const userImageUpdated = await prisma.user.update({
      where: { id: user.id },
      data: {
        image
      }
    })

    if (!userImageUpdated) {
      return {
        ok: false,
        message: 'User image not updated'
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
