'use server'

import prisma from '@/lib/prisma'
import { deleteCloudinaryResources } from '@/lib/cloudinary'

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
  } catch (error: unknown) {
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
  } catch (error: unknown) {
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
        vocabularySets: {
          include: {
            images: {
              orderBy: {
                order: 'asc'
              }
            }
          }
        },
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
  vocabularySets?: Array<{
    name: string
    images: Array<{ id?: string; imageUrl: string; fileName: string; order: number }>
  }>
  videos?: Array<{ id?: string; title: string; videoUrl: string; fileName: string; thumbnailUrl?: string; order: number }>
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
        vocabularySets: data.vocabularySets ? {
          create: data.vocabularySets.map(set => ({
            name: set.name,
            images: {
              create: set.images.map(img => ({
                imageUrl: img.imageUrl,
                fileName: img.fileName,
                order: img.order
              }))
            }
          }))
        } : undefined,
        videos: data.videos ? {
          create: data.videos.map(v => ({
            title: v.title,
            videoUrl: v.videoUrl,
            fileName: v.fileName,
            thumbnailUrl: v.thumbnailUrl,
            order: v.order
          }))
        } : undefined,
        forParents: data.forParents ? {
          create: data.forParents.map(f => ({
            message: f.message,
            documentUrl: f.documentUrl
          }))
        } : undefined,
        playlist: data.playlist ? {
          create: {
            title: data.playlist.title,
            url: data.playlist.url,
            links: data.playlist.links ? {
              create: data.playlist.links.map(l => ({
                title: l.title,
                url: l.url
              }))
            } : undefined
          }
        } : undefined
      },
      include: {
        levels: true,
        vocabularySets: {
          include: {
            images: {
              orderBy: {
                order: 'asc'
              }
            }
          }
        },
        videos: {
          orderBy: {
            order: 'asc'
          }
        },
        forParents: true,
        playlist: {
          include: {
            links: true
          }
        }
      }
    })

    return { ok: true, newsletter }
  } catch (error: unknown) {
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
    vocabularySets?: Array<{
      name: string
      images: Array<{ id?: string; imageUrl: string; fileName: string; order: number }>
    }>
    videos?: Array<{ id?: string; title: string; videoUrl: string; fileName: string; thumbnailUrl?: string; order: number }>
    forParents?: Array<{ id?: string; message: string; documentUrl?: string }>
    playlist?: {
      title?: string
      url?: string
      links?: Array<{ title?: string; url: string }>
    }
  }
) => {
  try {
    console.log('UPDATING NEWSLETTER:', id)
    console.log('DATA:', JSON.stringify(data, null, 2))
    // Use transaction to ensure atomicity
    const newsletter = await prisma.$transaction(async (tx) => {
      // 1. Fetch current assets to identify orphaned ones later
      const existingSets = await tx.vocabularySet.findMany({
        where: { newsletterId: id },
        include: { images: true }
      })
      const existingVideos = await tx.video.findMany({
        where: { newsletterId: id }
      })

      const oldImagePublicIds = existingSets.flatMap(s => s.images.map(img => img.imageUrl))
      const oldVideoPublicIds = existingVideos.map(v => v.videoUrl)

      // Get new public IDs from payload
      const newImagePublicIds = data.vocabularySets?.flatMap(s => s.images.map(img => img.imageUrl)) || []
      const newVideoPublicIds = data.videos?.map(v => v.videoUrl) || []

      // Identify orphaned (old ones not in new ones)
      const orphanedImages = oldImagePublicIds.filter(publicId => !newImagePublicIds.includes(publicId))
      const orphanedVideos = oldVideoPublicIds.filter(publicId => !newVideoPublicIds.includes(publicId))

      // Delete existing nested relations
      for (const set of existingSets) {
        await tx.vocabularyImage.deleteMany({ where: { setId: set.id } })
      }
      await tx.vocabularySet.deleteMany({ where: { newsletterId: id } })

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
      const updatedNewsletter = await tx.newsletter.update({
        where: { id },
        data: {
          title: data.title,
          month: data.month,
          year: data.year,
          levels: {
            set: data.levelIds.map(levelId => ({ id: levelId }))
          },
          vocabularySets: data.vocabularySets ? {
            create: data.vocabularySets.map(set => ({
              name: set.name,
              images: {
                create: set.images.map(img => ({
                  imageUrl: img.imageUrl,
                  fileName: img.fileName,
                  order: img.order
                }))
              }
            }))
          } : undefined,
          videos: data.videos ? {
            create: data.videos.map(v => ({
              title: v.title,
              videoUrl: v.videoUrl,
              fileName: v.fileName,
              thumbnailUrl: v.thumbnailUrl,
              order: v.order
            }))
          } : undefined,
          forParents: data.forParents ? {
            create: data.forParents.map(f => ({
              message: f.message,
              documentUrl: f.documentUrl
            }))
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
          vocabularySets: {
            include: {
              images: {
                orderBy: {
                  order: 'asc'
                }
              }
            }
          },
          videos: {
            orderBy: {
              order: 'asc'
            }
          },
          forParents: true,
          playlist: {
            include: {
              links: true
            }
          }
        }
      })

      // 4. Delete from Cloudinary (Orphaned assets)
      if (orphanedImages.length > 0) {
        await deleteCloudinaryResources(orphanedImages, 'image')
      }
      if (orphanedVideos.length > 0) {
        await deleteCloudinaryResources(orphanedVideos, 'video')
      }

      return updatedNewsletter
    })

    return { ok: true, newsletter }
  } catch (error: unknown) {
    console.log('AN ERROR OCCURRED DURING UPDATE', error)
    return { ok: false, message: 'Failed to update newsletter' }
  }
}

/**
 * Deletes a newsletter and all its nested relations (cascade handled by Prisma).
 */
export const deleteNewsletter = async (id: string) => {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Fetch all assets to delete from Cloudinary
      const existingSets = await tx.vocabularySet.findMany({
        where: { newsletterId: id },
        include: { images: true }
      })
      const existingVideos = await tx.video.findMany({
        where: { newsletterId: id }
      })

      const imagePublicIds = existingSets.flatMap(s => s.images.map(img => img.imageUrl))
      const videoPublicIds = existingVideos.map(v => v.videoUrl)

      // 2. Delete existing nested relations in DB
      for (const set of existingSets) {
        await tx.vocabularyImage.deleteMany({ where: { setId: set.id } })
      }
      await tx.vocabularySet.deleteMany({ where: { newsletterId: id } })
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

      // 3. Delete newsletter
      await tx.newsletter.delete({
        where: { id }
      })

      // 4. Delete from Cloudinary (Only if DB deletion succeeded)
      if (imagePublicIds.length > 0) {
        await deleteCloudinaryResources(imagePublicIds, 'image')
      }
      if (videoPublicIds.length > 0) {
        await deleteCloudinaryResources(videoPublicIds, 'video')
      }
    })

    return { ok: true }
  } catch (error: unknown) {
    console.log('AN ERROR OCCURRED DURING DELETE', error)
    return { ok: false, message: 'Failed to delete newsletter' }
  }
}
