import { useState, useEffect } from "react"

/**
 * Custom hook for scroll position tracking
 * Provides throttled scroll position for performance
 */

export function useScroll() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let ticking = false

    const updateScrollPosition = () => {
      setScrollY(window.scrollY)
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition)
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return { scrollY }
}

/**
 * Hook for scroll-based animations and effects
 */
export function useScrollEffects() {
  const { scrollY } = useScroll()
  
  // Calculate parallax offset for elements
  const getParallaxOffset = (multiplier: number = 0.02, index: number = 1) => {
    return scrollY * multiplier * index
  }

  return {
    scrollY,
    getParallaxOffset,
  }
}