'use server'

import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import prisma from '@/lib/prisma'

const userSchema = z.object({
  id: z
    .string()
    .uuid(),
  name: z
    .string()
    .min(3, { message: 'The name must have at least 3 characters' })
    .max(255, { message: 'The name must have less than 255 characters' }),
  email: z
    .string()
    .email({ message: 'The email is not valid' }),
  phoneNumber: z
    .string()
    .min(10, { message: 'The phone number must be 10 characters without the country code' })
    .max(10, { message: 'The phone number must be 10 characters without the country code' }),
  password: z
    .string()
    .optional()
    .refine(value => !value || (value.length >= 6 && value.length <= 10), {
      message: 'The password must be between 6 and 10 characters if provided'
    })
})

interface IData {
  id: string
  name: string
  email: string
  phoneNumber: string
  password?: string | null
}

export const updateUser = async (data: IData) => {
  try {
    const userParsed = userSchema.safeParse(data)

    if (!userParsed.success) {
      return {
        ok: false,
        message: 'Error updating user'
      }
    }

    const { name, email, password, id, phoneNumber } = userParsed.data

    const dataUserUpdated: {
      name: string
      email: string
      phoneNumber: string
      password?: string
    } = {
      name,
      email,
      phoneNumber
    }

    if (password && password.length > 0) {
      const encryptedPassword = bcrypt.hashSync(password)
      dataUserUpdated.password = encryptedPassword
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

    revalidatePath('/platform/admin/users')
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
