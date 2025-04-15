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
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
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
      message: 'Usuario creado correctamente',
      user
    }
  } catch (error) {

    console.error('Error al crear el usuario', error)
    return {
      ok: false,
      message: 'Error al crear el usuario'
    }
  }
}
