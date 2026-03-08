import { v2 as cloudinary } from 'cloudinary';

// Cloudinary automatically picks up CLOUDINARY_URL from process.env if available.
// If not, it can be configured manually.
cloudinary.config();

/**
 * Deletes multiple resources from Cloudinary by their public_ids.
 * @param publicIds Array of public IDs to delete
 * @param resourceType 'image' | 'video'
 */
export const deleteCloudinaryResources = async (publicIds: string[], resourceType: 'image' | 'video' = 'image') => {
  if (!publicIds || publicIds.length === 0) return;

  try {
    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: resourceType
    });
    console.log(`Cloudinary ${resourceType} deletion result:`, result);
    return result;
  } catch (error) {
    console.error(`Error deleting ${resourceType} resources from Cloudinary:`, error);
    throw error;
  }
};
