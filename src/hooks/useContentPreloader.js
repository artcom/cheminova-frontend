import { useEffect, useRef, useState } from "react"

/**
 * Advanced content preloader for lazy components and other assets
 * @param {object} config - Preload configuration
 * @param {boolean} shouldPreload - Whether to start preloading
 */
const useContentPreloader = (config = {}, shouldPreload = true) => {
  const preloadedComponents = useRef(new Set())
  const preloadPromises = useRef(new Map())
  const [preloadedComponentsCount, setPreloadedComponentsCount] = useState(0)

  useEffect(() => {
    if (!shouldPreload || !Object.keys(config).length) {
      return
    }

    const preloadContent = async () => {
      const { lazyComponents = [], customPreloaders = [] } = config

      // Preload lazy components
      for (const componentConfig of lazyComponents) {
        const { name, importFunction } = componentConfig

        if (preloadedComponents.current.has(name)) {
          continue
        }

        try {
          console.log(`🔄 Preloading lazy component: ${name}`)
          const modulePromise = importFunction()
          preloadPromises.current.set(name, modulePromise)

          await modulePromise
          preloadedComponents.current.add(name)
          setPreloadedComponentsCount(preloadedComponents.current.size)
          console.log(`✅ Preloaded lazy component: ${name}`)
        } catch (error) {
          console.warn(`❌ Failed to preload lazy component ${name}:`, error)
        }
      }

      // Execute custom preloaders
      for (const preloader of customPreloaders) {
        try {
          if (typeof preloader === "function") {
            await preloader()
          }
        } catch (error) {
          console.warn(`❌ Custom preloader failed:`, error)
        }
      }
    }

    // Start preloading after a small delay
    const timeoutId = setTimeout(preloadContent, 200)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [config, shouldPreload])

  return {
    isComponentPreloaded: (name) => preloadedComponents.current.has(name),
    getComponentPromise: (name) => preloadPromises.current.get(name),
    preloadedComponentsCount,
  }
}

export default useContentPreloader
