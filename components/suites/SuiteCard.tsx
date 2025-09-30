import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Suite } from "@/data/types"
import { calculateDailyRate } from "@/utils/pricing"

interface SuiteCardProps {
  suite: Suite
  onSelect: (suiteId: string) => void
}

export const SuiteCard = React.memo(function SuiteCard({ suite, onSelect }: SuiteCardProps) {
  const Icon = suite.icon
  
  const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (suite.available) {
        onSelect(suite.id)
      }
    }
  }, [onSelect, suite.id, suite.available])

  const handleClick = React.useCallback(() => {
    if (suite.available) {
      onSelect(suite.id)
    }
  }, [onSelect, suite.id, suite.available])

  return (
    <Card 
      className="border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl shadow-black/10 rounded-2xl overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all"
      role="button"
      tabIndex={0}
      aria-label={`${suite.name} suite - ${suite.available ? 'Available' : 'Unavailable'} - ${suite.isHourly ? 'From KSh 1,000 per hour' : `From KSh ${Math.floor(suite.weeklyRate / 7)} per night`}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <CardContent className="p-0">
        <SuiteImage suite={suite} />
        <SuiteContent suite={suite} onSelect={onSelect} />
      </CardContent>
    </Card>
  )
})

const SuiteImage = React.memo(function SuiteImage({ suite }: { suite: Suite }) {
  const Icon = suite.icon

  return (
    <div className="relative overflow-hidden rounded-t-2xl h-48 sm:h-64">
      <Image
        src={suite.image || "/placeholder.svg"}
        alt={`${suite.name} suite interior view showing luxury accommodations`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyKKXLHbQUpQr/2Q=="
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4" aria-hidden="true">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg shadow-black/10 border border-white/20">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
      </div>
    </div>
  )
})

function SuiteContent({ suite, onSelect }: { suite: Suite; onSelect: (suiteId: string) => void }) {
  return (
    <div className="p-4 sm:p-6 space-y-4">
      <SuiteInfo suite={suite} />
      <SuiteActions suite={suite} onSelect={onSelect} />
      <SuiteStatus suite={suite} />
    </div>
  )
}

function SuiteInfo({ suite }: { suite: Suite }) {
  return (
    <div>
      <h3 className="font-serif text-lg sm:text-xl text-foreground mb-2">
        {suite.name}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {suite.tagline}
      </p>
    </div>
  )
}

const SuiteActions = React.memo(function SuiteActions({ suite, onSelect }: { suite: Suite; onSelect: (suiteId: string) => void }) {
  const dailyRate = React.useMemo(() => calculateDailyRate(suite), [suite.weeklyRate])
  
  const handleSelect = React.useCallback(() => {
    onSelect(suite.id)
  }, [onSelect, suite.id])

  return (
    <div className="space-y-3">
      <div className="text-xs sm:text-sm text-muted-foreground">
        {suite.isHourly ? (
          <>From KSh 1,000/hour</>
        ) : (
          <>From KSh {dailyRate.toLocaleString()}/night</>
        )}
      </div>
      <Button
        onClick={handleSelect}
        size="sm"
        className="w-full bg-primary/90 hover:bg-primary backdrop-blur-sm text-primary-foreground group-hover:scale-105 transition-all duration-300 text-xs sm:text-sm shadow-lg shadow-primary/20 border border-white/20 rounded-xl hover:shadow-xl"
        disabled={!suite.available}
      >
        {suite.available 
          ? (suite.isHourly ? "Book by Hour" : "Select dates") 
          : "Unavailable"
        }
      </Button>
    </div>
  )
})

function SuiteStatus({ suite }: { suite: Suite }) {
  return (
    <div className="flex items-center justify-between text-xs pt-2 border-t border-white/20">
      <div className="flex items-center gap-2 text-green-600">
        <div
          className="w-2 h-2 bg-green-500 rounded-full shadow-lg shadow-green-500/50"
          style={{
            animation: "breathe 3s ease-in-out infinite",
          }}
          aria-hidden="true"
        />
        <span aria-live="polite">
          {suite.available ? "Available now" : "Currently unavailable"}
        </span>
      </div>
      <div className="text-muted-foreground" aria-label={`Last booked ${suite.lastBooked}`}>
        Last booked {suite.lastBooked}
      </div>
    </div>
  )
}