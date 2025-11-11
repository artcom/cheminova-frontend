export function preloadImages(imageUrls) {
  const promises = imageUrls.map((url) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(url)
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
      img.src = url
    })
  })

  return Promise.all(promises)
}
