import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'

/**
 * Returns a lazily-configured Cloudinary server instance.
 * Evaluated only on function execution to prevent Next.js App Router module load errors.
 */
function getCloudinary() {
  cloudinary.config(process.env.CLOUDINARY_URL ?? '')
  return cloudinary
}

export interface UploadProtectedOptions {
  folder: string
  publicId?: string
  resourceType?: 'image' | 'raw' | 'auto' | 'video'
  transformation?: object[]
}

export interface GetProtectedSignedUrlOptions {
  resourceType?: 'image' | 'raw' | 'video'
  transformation?: object[]
}

/**
 * Signs client-side upload parameters for CldUploadWidget using CLOUDINARY_API_SECRET.
 */
export function signUploadParams(paramsToSign: Record<string, unknown>): string {
  const cld = getCloudinary()
  const apiSecret =
    process.env.CLOUDINARY_API_SECRET || cld.config().api_secret || ''
  return cld.utils.api_sign_request(
    paramsToSign as Record<string, string | number | boolean>,
    apiSecret
  )
}

/**
 * Uploads a resource to Cloudinary with delivery type 'authenticated'.
 */
export async function uploadProtectedResource(
  fileDataUri: string,
  options: UploadProtectedOptions
): Promise<UploadApiResponse> {
  const cld = getCloudinary()
  return cld.uploader.upload(fileDataUri, {
    folder: options.folder,
    ...(options.publicId ? { public_id: options.publicId } : {}),
    type: 'authenticated',
    resource_type: options.resourceType || 'auto',
    ...(options.transformation ? { transformation: options.transformation } : {})
  })
}

/**
 * Generates a stable signed delivery URL using cloudinary.url (CDN-cacheable, no expiration).
 */
export function getProtectedSignedUrl(
  publicId: string,
  options: GetProtectedSignedUrlOptions = {}
): string {
  if (!publicId) return ''
  if (publicId.startsWith('http')) return publicId

  const cld = getCloudinary()
  const cleanPublicId = publicId.replace(/\.[^/.]+$/, '')

  return cld.url(cleanPublicId, {
    resource_type: options.resourceType || 'image',
    type: 'authenticated',
    sign_url: true,
    secure: true,
    ...(options.transformation ? { transformation: options.transformation } : {})
  })
}

/**
 * Generates a signed delivery URL for newsletter images with automatic optimization:
 * - quality: 'auto'
 * - fetch_format: 'auto'
 * - crop: 'limit', max width/height 1200
 */
export function getSignedImageUrl(publicId: string): string {
  if (!publicId) return ''
  if (publicId.startsWith('http')) return publicId

  const cld = getCloudinary()
  const cleanPublicId = publicId.replace(/\.[^/.]+$/, '')

  return cld.url(cleanPublicId, {
    resource_type: 'image',
    type: 'upload',
    sign_url: true,
    secure: true,
    transformation: [
      { width: 1200, height: 1200, crop: 'limit' },
      { quality: 'auto', fetch_format: 'auto' }
    ]
  })
}

/**
 * Generates a signed delivery URL for newsletter videos.
 */
export function getSignedVideoUrl(publicId: string): string {
  if (!publicId) return ''
  if (publicId.startsWith('http')) return publicId

  const cld = getCloudinary()
  const cleanPublicId = publicId.replace(/\.[^/.]+$/, '')

  return cld.url(cleanPublicId, {
    resource_type: 'video',
    type: 'upload',
    sign_url: true,
    secure: true
  })
}

/**
 * Generates a signed delivery URL for thumbnails derived from newsletter videos.
 */
export function getSignedVideoThumbnailUrl(publicId: string): string {
  if (!publicId) return ''
  if (publicId.startsWith('http')) return publicId

  const cld = getCloudinary()
  const baseId = publicId.split('.')[0]
  return cld.url(baseId, {
    resource_type: 'video',
    type: 'upload',
    sign_url: true,
    secure: true,
    format: 'jpg',
    transformation: [
      { width: 640, height: 360, crop: 'limit' },
      { quality: 'auto' }
    ]
  })
}

/**
 * Safely deletes a single resource from Cloudinary (supports authenticated and upload delivery types).
 */
export async function deleteCloudinaryResource(
  publicId: string,
  options: {
    resourceType?: 'image' | 'raw' | 'video'
    type?: 'authenticated' | 'upload'
  } = {}
) {
  const cld = getCloudinary()
  const resourceType = options.resourceType || 'image'
  const type = options.type || 'authenticated'

  try {
    const result = await cld.uploader.destroy(publicId, {
      resource_type: resourceType,
      type: type,
      invalidate: true
    })

    // If not found in authenticated, try upload (fallback)
    if (result && result.result !== 'ok' && type === 'authenticated') {
      return await cld.uploader.destroy(publicId, {
        resource_type: resourceType,
        type: 'upload',
        invalidate: true
      })
    }

    return result
  } catch (error) {
    console.error(`[Delete Cloudinary Resource Error] ${publicId}:`, error)
    return null
  }
}

/**
 * Deletes multiple upload resources from Cloudinary by their public_ids.
 */
export async function deleteMultipleCloudinaryResources(
  publicIds: string[],
  resourceType: 'image' | 'video' = 'image'
) {
  if (!publicIds || publicIds.length === 0) return

  const cld = getCloudinary()
  try {
    const result = await cld.api.delete_resources(publicIds, {
      resource_type: resourceType,
      type: 'upload'
    })
    return result
  } catch (error) {
    console.error(`[Delete Multiple Cloudinary Resources Error]:`, error)
    throw error
  }
}

// Backward compatibility aliases
export const deleteCloudinaryResources = deleteMultipleCloudinaryResources
