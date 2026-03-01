/**
 * Detects if a string is a full URL or a Cloudinary public_id.
 */
export const isFullUrl = (src: string): boolean => {
  return src.startsWith("http") || src.startsWith("/") || src.startsWith("data:")
}

/**
 * Resolves a Cloudinary public_id to a full image URL.
 */
export const getCloudinaryImageUrl = (publicId: string): string => {
  if (isFullUrl(publicId)) return publicId
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`
}

/**
 * Resolves a Cloudinary public_id to a full video URL.
 */
export const getCloudinaryVideoUrl = (publicId: string): string => {
  if (isFullUrl(publicId)) return publicId
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  // Automatically add .mp4 extension if not present for better compatibility with <video> tag
  const extension = publicId.includes(".") ? "" : ".mp4"
  return `https://res.cloudinary.com/${cloudName}/video/upload/${publicId}${extension}`
}

/**
 * Resolves a Cloudinary video public_id to a thumbnail image URL.
 */
export const getCloudinaryVideoThumbnail = (publicId: string): string => {
  if (isFullUrl(publicId)) return publicId
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  // Cloudinary generates images from videos by using a standard image extension
  const baseId = publicId.split(".")[0]
  return `https://res.cloudinary.com/${cloudName}/video/upload/${baseId}.jpg`
}
