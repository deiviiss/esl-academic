'use server'

import prisma from '@/lib/prisma'
import { validateUserAdmin } from '@/actions/auth/validate-user-admin'
import { revalidatePath } from 'next/cache'
import {
  deleteCloudinaryResources,
  getSignedImageUrl,
  getSignedVideoUrl,
  getSignedVideoThumbnailUrl
} from '@/lib/cloudinary.server'

/**
 * Fetches all newsletters associated with a specific level, ordered by year and month descending.
 */
export const getNewslettersByLevel = async (levelId: string) => {
  try {
    const newsletters = await prisma.newsletter.findMany({
      where: {
        isPublished: true,
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
 * Toggles newsletter visibility for users while keeping it available to admins.
 */
export const toggleNewsletterPublished = async (newsletterId: string) => {
  const isAdmin = await validateUserAdmin()

  if (!isAdmin) {
    return { ok: false, message: 'Unauthorized' }
  }

  try {
    const newsletter = await prisma.newsletter.findUnique({
      where: { id: newsletterId },
      select: { isPublished: true }
    })

    if (!newsletter) {
      return { ok: false, message: 'Newsletter not found' }
    }

    const updatedNewsletter = await prisma.newsletter.update({
      where: { id: newsletterId },
      data: { isPublished: !newsletter.isPublished }
    })

    revalidatePath('/platform/admin/newsletters')
    revalidatePath('/platform/academy/newsletters')

    return {
      ok: true,
      message: updatedNewsletter.isPublished
        ? 'Newsletter published successfully'
        : 'Newsletter hidden successfully',
      newsletter: updatedNewsletter
    }
  } catch (error: unknown) {
    console.error('Error toggling newsletter publication:', error)
    return { ok: false, message: 'Failed to update newsletter visibility' }
  }
}

/**
 * Fetches a single newsletter by ID with all its related content,
 * resolving authenticated public IDs into server-signed delivery URLs.
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
        videos: {
          orderBy: {
            order: 'asc'
          }
        },
        levels: true,
        forParents: true,
        playlist: {
          include: {
            links: true
          }
        }
      }
    })

    if (!newsletter) return null

    // Transform public IDs into server-signed delivery URLs in memory
    return {
      ...newsletter,
      vocabularySets: newsletter.vocabularySets.map((set) => ({
        ...set,
        images: set.images.map((img) => ({
          ...img,
          imageUrl: getSignedImageUrl(img.imageUrl)
        }))
      })),
      videos: newsletter.videos.map((video) => ({
        ...video,
        videoUrl: getSignedVideoUrl(video.videoUrl),
        thumbnailUrl: getSignedVideoThumbnailUrl(video.videoUrl)
      }))
    }
  } catch (error) {
    console.error('Error fetching newsletter by ID:', error)
    return null
  }
}


/**
 * Ensures clean public_id is stored in the database even if a full signed URL was passed.
 */
const extractPublicId = (urlOrPublicId: string, folderPrefix: string): string => {
  if (!urlOrPublicId) return ''
  if (!urlOrPublicId.startsWith('http')) return urlOrPublicId

  const folderIndex = urlOrPublicId.indexOf(folderPrefix)
  if (folderIndex !== -1) {
    const rawPath = urlOrPublicId.substring(folderIndex).split('?')[0]
    return rawPath.replace(/\.[^/.]+$/, '')
  }
  return urlOrPublicId
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
                imageUrl: extractPublicId(img.imageUrl, 'esl-academy/newsletters/vocabulary/'),
                fileName: img.fileName,
                order: img.order
              }))
            }
          }))
        } : undefined,
        videos: data.videos ? {
          create: data.videos.map(v => ({
            title: v.title,
            videoUrl: extractPublicId(v.videoUrl, 'esl-academy/newsletters/videos/'),
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
    // Use transaction to ensure atomicity
    let orphanedImages: string[] = []
    let orphanedVideos: string[] = []

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

      // Get sanitized new public IDs from payload
      const newImagePublicIds = data.vocabularySets?.flatMap(s => s.images.map(img => extractPublicId(img.imageUrl, 'esl-academy/newsletters/vocabulary/'))) || []
      const newVideoPublicIds = data.videos?.map(v => extractPublicId(v.videoUrl, 'esl-academy/newsletters/videos/')) || []

      // Identify orphaned (old ones not in new ones)
      orphanedImages = oldImagePublicIds.filter(publicId => !newImagePublicIds.includes(publicId))
      orphanedVideos = oldVideoPublicIds.filter(publicId => !newVideoPublicIds.includes(publicId))

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
                  imageUrl: extractPublicId(img.imageUrl, 'esl-academy/newsletters/vocabulary/'),
                  fileName: img.fileName,
                  order: img.order
                }))
              }
            }))
          } : undefined,
          videos: data.videos ? {
            create: data.videos.map(v => ({
              title: v.title,
              videoUrl: extractPublicId(v.videoUrl, 'esl-academy/newsletters/videos/'),
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

      return updatedNewsletter
    })

    // 4. Delete from Cloudinary (Orphaned assets, outside DB transaction)
    if (orphanedImages.length > 0) {
      await deleteCloudinaryResources(orphanedImages, 'image')
    }
    if (orphanedVideos.length > 0) {
      await deleteCloudinaryResources(orphanedVideos, 'video')
    }

    return { ok: true, newsletter }
  } catch (error: unknown) {
    console.error('Error updating newsletter:', error)
    return { ok: false, message: 'Failed to update newsletter' }
  }
}


/**
 * Deletes a newsletter and all its nested relations (cascade handled by Prisma).
 */
export const deleteNewsletter = async (id: string) => {
  try {
    let imagePublicIds: string[] = []
    let videoPublicIds: string[] = []

    await prisma.$transaction(async (tx) => {
      // 1. Fetch all assets to delete from Cloudinary
      const existingSets = await tx.vocabularySet.findMany({
        where: { newsletterId: id },
        include: { images: true }
      })
      const existingVideos = await tx.video.findMany({
        where: { newsletterId: id }
      })

      imagePublicIds = existingSets.flatMap(s => s.images.map(img => img.imageUrl))
      videoPublicIds = existingVideos.map(v => v.videoUrl)

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
    })

    // 4. Delete from Cloudinary (Outside DB transaction to prevent P2028 timeouts)
    if (imagePublicIds.length > 0) {
      await deleteCloudinaryResources(imagePublicIds, 'image')
    }
    if (videoPublicIds.length > 0) {
      await deleteCloudinaryResources(videoPublicIds, 'video')
    }

    return { ok: true }
  } catch (error: unknown) {
    console.log('AN ERROR OCCURRED DURING DELETE', error)
    return { ok: false, message: 'Failed to delete newsletter' }
  }
}

/**
 * Deletes uploaded images from Cloudinary when discarded in the form.
 */
export const deleteUploadedImages = async (publicIds: string[]) => {
  if (!publicIds || publicIds.length === 0) {
    return { ok: true, message: 'No images to delete' }
  }

  try {
    await deleteCloudinaryResources(publicIds, 'image')
    return { ok: true, message: 'Images deleted from Cloudinary' }
  } catch (error) {
    console.error('Error deleting images from Cloudinary:', error)
    return { ok: false, message: 'Failed to delete images from Cloudinary' }
  }
}
