import { useEffect, useRef, useState } from "react"

interface UseIntersectionObserverOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return

        const isElementIntersecting = entry.isIntersecting
        setIsIntersecting(isElementIntersecting)

        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin, triggerOnce, hasIntersected])

  return {
    ref: elementRef,
    isIntersecting,
    hasIntersected
  }
}

export function useViewportOptimization() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  
  const registerSection = (sectionId: string, isVisible: boolean) => {
    setVisibleSections(prev => {
      const newSet = new Set(prev)
      if (isVisible) {
        newSet.add(sectionId)
      } else {
        newSet.delete(sectionId)
      }
      return newSet
    })
  }

  const isSectionVisible = (sectionId: string) => visibleSections.has(sectionId)

  return { registerSection, isSectionVisible }
}

export function useLazyLoading<T extends HTMLElement = HTMLDivElement>() {
  const [shouldLoad, setShouldLoad] = useState(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setShouldLoad(true)
          observer.unobserve(element)
        }
      },
      { rootMargin: "100px 0px" } // Start loading 100px before visible
    )

    observer.observe(element)

    return () => observer.unobserve(element)
  }, [])

  return { ref, shouldLoad }
}