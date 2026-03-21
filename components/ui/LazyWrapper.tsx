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
    <div className="relative border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/10 rounded-2xl overflow-hidden overflow-hidden">
      {/* Premium Shimmer Overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 z-10" />

      <div className="p-6 sm:p-8 space-y-8 relative">
        <div className="h-8 bg-white/10 rounded-lg w-1/3"></div>
        <div className="space-y-6">
          <div className="h-32 bg-white/5 rounded-xl border border-white/10"></div>
          <div className="flex justify-between items-center px-2">
            <div className="h-5 bg-white/10 rounded w-24"></div>
            <div className="h-5 bg-white/10 rounded w-32"></div>
          </div>
        </div>
        <div className="h-14 bg-primary/20 rounded-xl w-full border border-primary/20"></div>
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