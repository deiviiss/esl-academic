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

/**
 * Creates a new newsletter with all nested relations (vocabularies, videos, forParents, playlist).
 */
export const createNewsletter = async (data: {
  title: string
  month: Date
  year: number
  levelIds: string[]
  vocabularies?: Array<{ word: string; pronunciation: string; imageUrl: string }>
  videos?: Array<{ title: string; videoUrl: string; thumbnailUrl?: string }>
  forParents?: Array<{ message: string; documentUrl?: string }>
  playlist?: {
    title?: string
    url?: string
    links?: Array<{ title?: string; url: string }>
  }
}) => {
  try {
    const newsletter = await prisma.newsletter.create({
      data: {
        title: data.title,
        month: data.month,
        year: data.year,
        levels: {
          connect: data.levelIds.map(id => ({ id }))
        },
        vocabularies: data.vocabularies ? {
          create: data.vocabularies
        } : undefined,
        videos: data.videos ? {
          create: data.videos
        } : undefined,
        forParents: data.forParents ? {
          create: data.forParents
        } : undefined,
        playlist: data.playlist ? {
          create: {
            title: data.playlist.title,
            url: data.playlist.url,
            links: data.playlist.links ? {
              create: data.playlist.links
            } : undefined
          }
        } : undefined
      },
      include: {
        levels: true,
        vocabularies: true,
        videos: true,
        forParents: true,
        playlist: {
          include: {
            links: true
          }
        }
      }
    })

    return { ok: true, newsletter }
  } catch (error) {
    console.error('Error creating newsletter:', error)
    return { ok: false, message: 'Failed to create newsletter' }
  }
}

/**
 * Updates an existing newsletter with all nested relations.
 * Replaces vocabularies, videos, forParents, and playlist completely.
 */
export const updateNewsletter = async (
  id: string,
  data: {
    title: string
    month: Date
    year: number
    levelIds: string[]
    vocabularies?: Array<{ word: string; pronunciation: string; imageUrl: string }>
    videos?: Array<{ title: string; videoUrl: string; thumbnailUrl?: string }>
    forParents?: Array<{ message: string; documentUrl?: string }>
    playlist?: {
      title?: string
      url?: string
      links?: Array<{ title?: string; url: string }>
    }
  }
) => {
  try {
    // Use transaction to ensure atomicity
    const newsletter = await prisma.$transaction(async (tx) => {
      // Delete existing nested relations
      await tx.vocabulary.deleteMany({ where: { newsletterId: id } })
      await tx.video.deleteMany({ where: { newsletterId: id } })
      await tx.forParents.deleteMany({ where: { newsletterId: id } })

      // Delete playlist and its links
      const existingPlaylist = await tx.playlist.findUnique({
        where: { newsletterId: id }
      })
      if (existingPlaylist) {
        await tx.playlistLink.deleteMany({ where: { playlistId: existingPlaylist.id } })
        await tx.playlist.delete({ where: { id: existingPlaylist.id } })
      }

      // Update newsletter with new data
      return await tx.newsletter.update({
        where: { id },
        data: {
          title: data.title,
          month: data.month,
          year: data.year,
          levels: {
            set: data.levelIds.map(levelId => ({ id: levelId }))
          },
          vocabularies: data.vocabularies ? {
            create: data.vocabularies
          } : undefined,
          videos: data.videos ? {
            create: data.videos
          } : undefined,
          forParents: data.forParents ? {
            create: data.forParents
          } : undefined,
          playlist: data.playlist ? {
            create: {
              title: data.playlist.title,
              url: data.playlist.url,
              links: data.playlist.links ? {
                create: data.playlist.links
              } : undefined
            }
          } : undefined
        },
        include: {
          levels: true,
          vocabularies: true,
          videos: true,
          forParents: true,
          playlist: {
            include: {
              links: true
            }
          }
        }
      })
    })

    return { ok: true, newsletter }
  } catch (error) {
    console.error('Error updating newsletter:', error)
    return { ok: false, message: 'Failed to update newsletter' }
  }
}

/**
 * Deletes a newsletter and all its nested relations (cascade handled by Prisma).
 */
export const deleteNewsletter = async (id: string) => {
  try {
    await prisma.newsletter.delete({
      where: { id }
    })

    return { ok: true }
  } catch (error) {
    console.error('Error deleting newsletter:', error)
    return { ok: false, message: 'Failed to delete newsletter' }
  }
}
