'use server'

import { revalidatePath } from 'next/cache'
import { validateUserAdmin } from '@/actions/auth/validate-user-admin'
import prisma from '@/lib/prisma'

interface Props {
  id: string
  status: boolean
}

export const toggleUserStatus = async ({ id, status }: Props) => {
  try {
    const isAdmin = await validateUserAdmin()

    if (!isAdmin) {
      return {
        ok: false,
        message: 'Debe estar autenticado como administrador'
      }
    }

    const newStatus = !status

    const userDeleted = await prisma.user.update({
      where: { id },
      data: {
        isActive: newStatus
      }
    })

    if (!userDeleted) {
      return {
        ok: false,
        message: 'Usuario no encontrado'
      }
    }

    revalidatePath('/admin/users')

    return {
      ok: true,
      message: userDeleted.isActive ? 'Usuario activado correctamente' : 'Usuario desactivado correctamente'
    }
  } catch (error) {
    console.error('Error al cambiar el estado del usuario:', error)
    return {
      ok: false,
      message: 'Error al desactivar usuario, contacta a soporte'
    }
  }
}
