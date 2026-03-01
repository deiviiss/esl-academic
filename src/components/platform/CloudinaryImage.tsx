"use client"

import Image from "next/image"
import { CldImage } from "next-cloudinary"
import { isFullUrl } from "@/utils/cloudinary.utils"

interface CloudinaryImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
}

/**
 * A wrapper component that intelligently chooses between Next.js Image 
 * and Cloudinary CldImage based on the source format.
 */
export const CloudinaryImage = (props: CloudinaryImageProps) => {
  const { src, alt, ...rest } = props

  // Check if it's a full URL or a relative path
  if (isFullUrl(src)) {
    return <Image src={src} alt={alt} {...rest} />
  }

  // Otherwise, treat as Cloudinary public_id
  return <CldImage src={src} alt={alt} {...rest} />
}
