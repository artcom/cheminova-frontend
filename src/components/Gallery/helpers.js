export const getPersistedPersonalImages = (defaults, capturedImages = []) => {
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

export const formatUploadedImagesForGallery = (uploadedImages = []) => {
  return uploadedImages.reduce((accumulator, item) => {
    const source = item?.image?.url || item?.image?.file

    if (source) {
      accumulator.push(source)
    }

    return accumulator
  }, [])
}

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
