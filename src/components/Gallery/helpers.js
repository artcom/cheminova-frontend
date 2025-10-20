export const getPersistedPersonalImages = (defaults, capturedImages = []) => {
  // Use captured images from memory instead of localStorage
  if (Array.isArray(capturedImages) && capturedImages.some(Boolean)) {
    return defaults.map((d, i) => capturedImages[i] || d)
  }
  return defaults
}

export const buildImagePoolFromGlob = (globObj) => {
  const entries = Object.entries(globObj)
  entries.sort(([a], [b]) => a.localeCompare(b))
  return entries.map(([, url]) => url)
}

/**
 * Convert uploaded images data from API to gallery format
 * @param {Array} uploadedImages - Array of uploaded image objects from API
 * @returns {Array} Array of image URLs for gallery display
 */
export const formatUploadedImagesForGallery = (uploadedImages = []) => {
  return uploadedImages.reduce((accumulator, item) => {
    const source = item?.image?.url || item?.image?.file

    if (source) {
      accumulator.push(source)
    }

    return accumulator
  }, [])
}

/**
 * Build combined image pool including uploaded images and static cologne images
 * @param {Object} cologneGlobObj - Glob object with cologne cathedral images
 * @param {Array} uploadedImages - Array of uploaded image objects from API
 * @returns {Object} Combined image pool with categorized images
 */
export const buildCombinedImagePool = (cologneGlobObj, uploadedImages = []) => {
  const cologneImages = buildImagePoolFromGlob(cologneGlobObj)
  const uploadedImageUrls = formatUploadedImagesForGallery(uploadedImages)

  return {
    cologne: cologneImages,
    uploaded: uploadedImageUrls,
    combined: [...cologneImages, ...uploadedImageUrls],
    stats: {
      cologneCount: cologneImages.length,
      uploadedCount: uploadedImageUrls.length,
      totalCount: cologneImages.length + uploadedImageUrls.length,
    },
  }
}
