'use server'

import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

interface RegisterUser {
  name: string
  email: string
  phoneNumber: string
  password: string
}

export const registerUser = async (data: RegisterUser) => {
  try {
    const normalizedEmail = data.email.toLowerCase().trim()

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (existingUser) {
      return {
        ok: false,
        message: 'No fue posible completar el registro. Si ya tienes una cuenta registrada, intenta iniciar sesión.'
      }
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: normalizedEmail,
        phoneNumber: `${data.phoneNumber}`,
        password: bcrypt.hashSync(data.password)
      },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        email: true
      }
    })

    return {
      ok: true,
      message: 'User created successfully',
      user
    }
  } catch (error) {
    console.error('Error creating user:', error instanceof Error ? error.message : error)
    return {
      ok: false,
      message: 'No fue posible completar el registro. Intenta de nuevo más tarde.'
    }
  }
}
