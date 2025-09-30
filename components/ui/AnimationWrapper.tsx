import React from "react"

interface AnimationWrapperProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}

export function FadeInUp({ 
  children, 
  className = "", 
  delay = 0, 
  duration = 0.6 
}: AnimationWrapperProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: '50px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`transition-all ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transitionDuration: `${duration}s`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </div>
  )
}

export function ScaleOnHover({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div 
      className={`transition-transform duration-300 ease-out hover:scale-[1.02] ${className}`}
      style={{ willChange: 'transform' }}
    >
      {children}
    </div>
  )
}

export function FadeIn({ 
  children, 
  className = "", 
  delay = 0 
}: { children: React.ReactNode; className?: string; delay?: number }) {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`transition-opacity duration-500 ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
      }}
    >
      {children}
    </div>
  )
}

// Optimized animation for step transitions
export function SlideInFromRight({ 
  children, 
  isVisible, 
  className = "" 
}: { 
  children: React.ReactNode; 
  isVisible: boolean; 
  className?: string 
}) {
  return (
    <div
      className={`transition-all duration-300 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(20px)',
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  )
}