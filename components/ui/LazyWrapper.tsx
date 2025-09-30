import React, { Suspense } from "react"

interface LazyWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  minHeight?: string
}

export function LazyWrapper({ 
  children, 
  fallback = <LoadingSkeleton />, 
  minHeight = "200px" 
}: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      <div style={{ minHeight }}>
        {children}
      </div>
    </Suspense>
  )
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className="h-4 bg-white/10 rounded w-3/4"></div>
      <div className="h-4 bg-white/10 rounded w-1/2"></div>
      <div className="h-8 bg-white/10 rounded w-full"></div>
    </div>
  )
}

export function BookingFlowSkeleton() {
  return (
    <div className="animate-pulse border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl shadow-black/10 rounded-2xl overflow-hidden">
      <div className="p-6 sm:p-8 space-y-6">
        <div className="h-6 bg-white/10 rounded w-1/3"></div>
        <div className="space-y-4">
          <div className="h-4 bg-white/10 rounded w-full"></div>
          <div className="h-4 bg-white/10 rounded w-2/3"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-white/10 rounded"></div>
          <div className="h-10 bg-white/10 rounded"></div>
        </div>
        <div className="h-12 bg-white/10 rounded w-full"></div>
      </div>
    </div>
  )
}

export function SuiteCardSkeleton() {
  return (
    <div className="animate-pulse border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl shadow-black/10 rounded-2xl overflow-hidden">
      <div className="h-48 sm:h-64 bg-white/10"></div>
      <div className="p-4 sm:p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-5 bg-white/10 rounded w-3/4"></div>
          <div className="h-4 bg-white/10 rounded w-full"></div>
        </div>
        <div className="h-4 bg-white/10 rounded w-1/2"></div>
        <div className="h-10 bg-white/10 rounded w-full"></div>
      </div>
    </div>
  )
}