import React from "react"
import { useLazyLoading } from "@/hooks/useIntersectionObserver"

interface LazySectionProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
  minHeight?: string
}

export function LazySection({ 
  children, 
  fallback = <SectionSkeleton />, 
  className = "",
  minHeight = "300px"
}: LazySectionProps) {
  const { ref, shouldLoad } = useLazyLoading<HTMLDivElement>()

  return (
    <div 
      ref={ref} 
      className={className}
      style={{ minHeight }}
    >
      {shouldLoad ? children : fallback}
    </div>
  )
}

function SectionSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className="h-6 bg-white/10 rounded w-1/2"></div>
      <div className="space-y-2">
        <div className="h-4 bg-white/10 rounded w-full"></div>
        <div className="h-4 bg-white/10 rounded w-3/4"></div>
        <div className="h-4 bg-white/10 rounded w-5/6"></div>
      </div>
    </div>
  )
}

export function LazyImage({ 
  src, 
  alt, 
  className = "",
  fallbackSrc = "/placeholder.svg"
}: {
  src: string
  alt: string
  className?: string
  fallbackSrc?: string
}) {
  const { ref, shouldLoad } = useLazyLoading<HTMLDivElement>()
  const [imageSrc, setImageSrc] = React.useState(fallbackSrc)
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    if (shouldLoad && src !== fallbackSrc) {
      const img = new Image()
      img.onload = () => {
        setImageSrc(src)
        setIsLoaded(true)
      }
      img.onerror = () => {
        setImageSrc(fallbackSrc)
        setIsLoaded(true)
      }
      img.src = src
    }
  }, [shouldLoad, src, fallbackSrc])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-50'
        }`}
        loading="lazy"
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-white/10 animate-pulse" />
      )}
    </div>
  )
}