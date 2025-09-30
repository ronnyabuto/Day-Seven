import type { LucideIcon } from "lucide-react"

/**
 * Core domain types for Day Seven application
 * Centralized type definitions for better maintainability
 */

export interface Suite {
  id: string
  name: string
  tagline: string
  image: string
  highlights: string[]
  weeklyRate: number
  monthlyRate: number
  icon: LucideIcon
  available: boolean
  colorTemp: "cool" | "warm" | "neutral" | "muted"
  lastBooked: string
  isHourly?: boolean
}

export interface DateRange {
  from?: Date
  to?: Date
}

export interface GuestInfo {
  name: string
  email: string
  phone: string
}

export interface BookingState {
  selectedSuite: string | null
  bookingStep: number
  selectedDates: DateRange
  guestInfo: GuestInfo
  selectedHours: number
  validationErrors: Record<string, string>
}

export interface StayCalculation {
  days: number
  hours?: number
  rate: number
  discount: number
}

export interface BookingStepProps {
  onNext: () => void
  onBack: () => void
  isValid: boolean
}

export type ColorTemperature = Suite["colorTemp"]
export type SuiteId = Suite["id"]

// Constants
export const BOOKING_STEPS = {
  DATE_SELECTION: 0,
  GUEST_INFO: 1,
  CONFIRMATION: 2,
} as const

export const SUITE_IDS = {
  NOMAD: "nomad",
  MINIMALIST: "minimalist", 
  WELLNESS: "wellness",
  PAUSE: "pause",
} as const

export const HOURLY_RATES = {
  1: 1000,
  2: 1800,
  3: 4800,
} as const

export const DEFAULT_HOURLY_RATE = 1500 // For 4+ hours
export const WEEKLY_DISCOUNT = 0.1
export const MONTHLY_DISCOUNT = 0.15