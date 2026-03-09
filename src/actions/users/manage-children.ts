'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const addChild = async (userId: string, name: string, levelId: string) => {
  try {
    const child = await prisma.$transaction(async (tx) => {
      const newChild = await tx.child.create({
        data: {
          name,
          levelId
        }
      })

      await tx.parentChild.create({
        data: {
          userId,
          childId: newChild.id
        }
      })

      return newChild
    })

    revalidatePath(`/platform/admin/users/${userId}`)
    return { ok: true, child }
  } catch (error) {
    console.error('Error adding child:', error)
    return { ok: false, message: 'Failed to add child' }
  }
}

export const updateChild = async (childId: string, name: string, levelId: string, userId: string) => {
  try {
    const child = await prisma.child.update({
      where: { id: childId },
      data: {
        name,
        levelId
      }
    })

    revalidatePath(`/platform/admin/users/${userId}`)
    return { ok: true, child }
  } catch (error) {
    console.error('Error updating child:', error)
    return { ok: false, message: 'Failed to update child' }
  }
}

export const removeChild = async (childId: string, userId: string) => {
  try {
    await prisma.$transaction(async (tx) => {
      // Delete the relation first (Prisma handles this if defined but being explicit is safer)
      await tx.parentChild.deleteMany({
        where: { childId }
      })

      await tx.child.delete({
        where: { id: childId }
      })
    })

    revalidatePath(`/platform/admin/users/${userId}`)
    return { ok: true }
  } catch (error) {
    console.error('Error removing child:', error)
    return { ok: false, message: 'Failed to remove child' }
  }
}
