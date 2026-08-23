'use server'

import { z } from 'zod'
import { deleteCloudinaryResource } from '@/lib/cloudinary.server'

const imageSchema = z.string().url("Invalid image URL");

export const deleteUserImage = async (imageUrl: string) => {
  if (!imageUrl || imageUrl.trim() === "") {
    return {
      ok: true,
      message: "No image to delete"
    };
  }

  const imageParsed = imageSchema.safeParse(imageUrl);

  if (!imageParsed.success) {
    return {
      ok: false,
      message: 'Error validating image'
    }
  }

  const image = imageParsed.data

  let publicId = "";
  const avatarFolderIndex = image.indexOf("esl-academy/user-avatars/");

  if (avatarFolderIndex !== -1) {
    const rawPath = image.substring(avatarFolderIndex).split("?")[0];
    publicId = rawPath.replace(/\.[^/.]+$/, "");
  } else {
    // Fallback: extract last segments
    const parts = image.split('/');
    const publicIdWithExtension = parts.slice(-3).join('/');
    publicId = publicIdWithExtension.split('.').slice(0, -1).join('.');
  }

  try {
    const result = await deleteCloudinaryResource(publicId, {
      resourceType: "image",
      type: "authenticated"
    });

    if (result && result.result !== 'ok' && result.result !== 'not found') {
      return {
        ok: false,
        message: 'Error deleting image'
      }
    }

    return {
      ok: true,
      message: 'Deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting user avatar:', error)
    return {
      ok: false,
      message: 'Error deleting user image, please contact support'
    }
  }
}
