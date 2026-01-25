"use client"

import React, { Suspense } from "react"
import dynamic from "next/dynamic"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { SuiteGrid } from "@/components/suites/SuiteGrid"
import { useBooking } from "@/hooks/useBooking"
import { useSuiteSelection } from "@/hooks/useSuiteSelection"
import { getSuiteById } from "@/data/suites"
import { BookingFlowSkeleton } from "@/components/ui/LazyWrapper"
import { ErrorBoundary, BookingErrorBoundary, SuiteErrorBoundary } from "@/components/ui/ErrorBoundary"

// Lazy load heavy components that aren't immediately visible
const SuiteDetails = dynamic(() => import("@/components/suites/SuiteDetails").then(mod => ({ default: mod.SuiteDetails })), {
  loading: () => <div className="animate-pulse h-64 bg-white/10 rounded-2xl"></div>
})

const BookingFlow = dynamic(() => import("@/components/booking/BookingFlow").then(mod => ({ default: mod.BookingFlow })), {
  loading: () => <BookingFlowSkeleton />
})

const HeroSection = dynamic(() => import("@/components/sections/HeroSection").then(mod => ({ default: mod.HeroSection })), {
  loading: () => <div className="animate-pulse h-96 bg-white/10 rounded-2xl"></div>
})

const LocationSection = dynamic(() => import("@/components/sections/LocationSection").then(mod => ({ default: mod.LocationSection })), {
  loading: () => <div className="animate-pulse h-64 bg-white/10 rounded-2xl"></div>
})

import { InternetSpeed } from "@/components/ui/internet-speed"

/**
 * Refactored HomePage component
 * Demonstrates modern React architecture with modular components
 */

export default function HomePage() {
  const {
    selectedSuite,
    selectSuite,
    resetBooking
  } = useBooking()

  const { updateTime } = useSuiteSelection()

  // Update time periodically for evening detection
  React.useEffect(() => {
    const timer = setInterval(updateTime, 60000) // Update every minute
    return () => clearInterval(timer)
  }, [updateTime])

  const selectedSuiteData = selectedSuite ? getSuiteById(selectedSuite) : null

  // Render suite details and booking flow when suite is selected
  if (selectedSuite && selectedSuiteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
        <Header showBackButton onBackClick={resetBooking} />

        <main className="max-w-6xl mx-auto px-6 py-12">
          <SuiteErrorBoundary>
            <Suspense fallback={<div className="animate-pulse h-64 bg-white/10 rounded-2xl mb-6"></div>}>
              <SuiteDetails suite={selectedSuiteData} />
            </Suspense>
          </SuiteErrorBoundary>
          <BookingErrorBoundary>
            <Suspense fallback={<BookingFlowSkeleton />}>
              <BookingFlow suite={selectedSuiteData} />
            </Suspense>
          </BookingErrorBoundary>
        </main>
      </div>
    )
  }

  // Render main landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
        <SuiteGrid onSuiteSelect={selectSuite} />
        <Suspense fallback={<div className="animate-pulse h-96 bg-white/10 rounded-2xl mb-16"></div>}>
          <HeroSection />
        </Suspense>

        <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <InternetSpeed />
          </div>
          <div className="md:col-span-2 flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div>
              <h3 className="text-xl font-medium mb-2">Remote Work Ready</h3>
              <p className="text-muted-foreground">
                Every suite comes with a verify speed test,
                ergonomic setup, and 24/7 power backup.
              </p>
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="animate-pulse h-64 bg-white/10 rounded-2xl"></div>}>
          <LocationSection />
        </Suspense>
      </main>

      <Footer />
      <GlobalStyles />
    </div>
  )
}

/**
 * Global styles for animations
 * Moved from inline styles for better maintainability
 */
function GlobalStyles() {
  return (
    <style jsx>{`
      @keyframes breathe {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.7; }
      }
    `}</style>
  )
}