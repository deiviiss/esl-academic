'use server'

import prisma from '@/lib/prisma'

/**
 * Fetches all levels for use in forms and selectors, including counts of newsletters and children.
 */
export const getAllLevels = async () => {
  try {
    const levels = await prisma.level.findMany({
      include: {
        _count: {
          select: {
            newsletters: true,
            children: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return levels
  } catch (error) {
    console.error('Error fetching all levels:', error)
    return []
  }
}

/**
 * Creates a new academic level.
 */
export const createLevel = async (name: string) => {
  try {
    const level = await prisma.level.create({
      data: { name }
    })
    return { ok: true, level }
  } catch (error) {
    console.error('Error creating level:', error)
    return { ok: false, message: 'Failed to create level' }
  }
}

/**
 * Updates an existing level's name.
 */
export const updateLevel = async (id: string, name: string) => {
  try {
    const level = await prisma.level.update({
      where: { id },
      data: { name }
    })
    return { ok: true, level }
  } catch (error) {
    console.error('Error updating level:', error)
    return { ok: false, message: 'Failed to update level' }
  }
}

/**
 * Deletes a level if it has no associated newsletters or children.
 */
export const deleteLevel = async (id: string) => {
  try {
    // Check for associations first
    const level = await prisma.level.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            newsletters: true,
            children: true
          }
        }
      }
    })

    if (!level) return { ok: false, message: 'Level not found' }

    if (level._count.newsletters > 0 || level._count.children > 0) {
      return {
        ok: false,
        message: 'Cannot delete level with associated newsletters or children. Please remove them first.'
      }
    }

    await prisma.level.delete({
      where: { id }
    })

    return { ok: true }
  } catch (error) {
    console.error('Error deleting level:', error)
    return { ok: false, message: 'Failed to delete level' }
  }
}
