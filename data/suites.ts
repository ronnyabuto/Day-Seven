import { Monitor, Coffee, Leaf, Clock } from "lucide-react"
import { env } from "@/lib/env"
import type { Suite } from "./types"

/**
 * Suite configuration data
 * Extracted from component for better maintainability and testing
 */

export const suites: Suite[] = [
  {
    id: "nomad",
    name: "Nomad Suite",
    tagline: "Workspace with monitor + fast WiFi for techies",
    image: env.IMAGES.NOMAD_SUITE,
    highlights: [
      "Dedicated workspace",
      '27" 4K monitor',
      "100Mbps fiber WiFi", 
      "Ergonomic chair",
      "Backup power"
    ],
    weeklyRate: 28000,
    monthlyRate: 95000,
    icon: Monitor,
    available: true,
    colorTemp: "cool",
    lastBooked: "3 hours ago",
  },
  {
    id: "minimalist",
    name: "Minimalist Escape", 
    tagline: "Neutral, uncluttered, calming space",
    image: env.IMAGES.MINIMALIST_SUITE,
    highlights: [
      "Neutral color palette",
      "Quality linens",
      "Uncluttered design",
      "Natural materials",
      "Quiet environment",
    ],
    weeklyRate: 25000,
    monthlyRate: 85000,
    icon: Coffee,
    available: true,
    colorTemp: "neutral",
    lastBooked: "1 hour ago",
  },
  {
    id: "wellness",
    name: "Wellness Corner",
    tagline: "Plants, yoga mat, light-filled space", 
    image: env.IMAGES.WELLNESS_SUITE,
    highlights: [
      "Yoga mat included",
      "Air-purifying plants", 
      "Natural light",
      "Meditation corner",
      "Essential oils"
    ],
    weeklyRate: 30000,
    monthlyRate: 100000,
    icon: Leaf,
    available: true,
    colorTemp: "warm",
    lastBooked: "30 minutes ago",
  },
  {
    id: "pause",
    name: "Pause",
    tagline: "Stay for the hours you need",
    image: env.IMAGES.PAUSE_SUITE,
    highlights: [
      "Flexible hourly stays",
      "Perfect for layovers",
      "Between meetings",
      "Private rest space", 
      "Meals available every 6 hours",
    ],
    weeklyRate: 0, // Not applicable for hourly
    monthlyRate: 0, // Not applicable for hourly
    icon: Clock,
    available: true,
    colorTemp: "muted",
    lastBooked: "45 minutes ago",
    isHourly: true,
  },
]

/**
 * Helper functions for suite data manipulation
 */

export const getSuiteById = (id: string): Suite | undefined => {
  return suites.find(suite => suite.id === id)
}

export const getAvailableSuites = (): Suite[] => {
  return suites.filter(suite => suite.available)
}

export const getHourlySuites = (): Suite[] => {
  return suites.filter(suite => suite.isHourly)
}

export const getNightlySuites = (): Suite[] => {
  return suites.filter(suite => !suite.isHourly)
}