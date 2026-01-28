'use server'

import prisma from '@/lib/prisma'

/**
 * Fetches all newsletters associated with a specific level, ordered by year and month descending.
 */
export const getNewslettersByLevel = async (levelId: string) => {
  try {
    const newsletters = await prisma.newsletter.findMany({
      where: {
        levels: {
          some: {
            id: levelId
          }
        }
      },
      include: {
        levels: true
      },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ]
    })

    return newsletters
  } catch (error) {
    console.error('Error fetching newsletters by level:', error)
    return []
  }
}

/**
 * Fetches all newsletters (for Admin), ordered by year and month descending.
 */
export const getAllNewsletters = async () => {
  try {
    const newsletters = await prisma.newsletter.findMany({
      include: {
        levels: true
      },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ]
    })

    return newsletters
  } catch (error) {
    console.error('Error fetching all newsletters:', error)
    return []
  }
}

/**
 * Fetches a single newsletter by ID with all its related content.
 */
export const getNewsletterById = async (id: string) => {
  try {
    const newsletter = await prisma.newsletter.findUnique({
      where: { id },
      include: {
        vocabularies: true,
        videos: true,
        levels: true,
        forParents: true,
        playlist: {
          include: {
            links: true
          }
        }
      }
    })

    return newsletter
  } catch (error) {
    console.error('Error fetching newsletter by ID:', error)
    return null
  }
}
