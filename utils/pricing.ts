import type { Suite, StayCalculation, DateRange } from "@/data/types"
import { HOURLY_RATES, DEFAULT_HOURLY_RATE, WEEKLY_DISCOUNT, MONTHLY_DISCOUNT } from "@/data/types"

/**
 * Pricing calculation utilities
 * Pure functions for business logic calculations
 */

export function calculateHourlyRate(hours: number): number {
  if (hours === 1) return HOURLY_RATES[1]
  if (hours === 2) return HOURLY_RATES[2]
  if (hours === 3) return HOURLY_RATES[3]
  return hours * DEFAULT_HOURLY_RATE // 4+ hours at DEFAULT_HOURLY_RATE/hour
}

export function calculateStayDuration(dates: DateRange): number {
  if (!dates.from || !dates.to) return 0
  
  const timeDiff = dates.to.getTime() - dates.from.getTime()
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
}

export function calculateStay(
  suite: Suite, 
  dates: DateRange, 
  hours: number = 1
): StayCalculation {
  // Handle hourly bookings
  if (suite.isHourly) {
    const rate = calculateHourlyRate(hours)
    return { 
      days: 0, 
      hours, 
      rate, 
      discount: 0 
    }
  }

  // Handle nightly bookings
  const days = calculateStayDuration(dates)
  if (days === 0) {
    return { days: 0, rate: 0, discount: 0 }
  }

  let rate = 0
  let discount = 0

  if (days >= 30) {
    rate = suite.monthlyRate
    discount = MONTHLY_DISCOUNT
  } else if (days >= 7) {
    rate = (suite.weeklyRate / 7) * days
    discount = WEEKLY_DISCOUNT
  } else {
    rate = (suite.weeklyRate / 7) * days
  }

  return { 
    days, 
    rate: rate * (1 - discount), 
    discount 
  }
}

export function formatCurrency(amount: number): string {
  return `KSh ${amount.toLocaleString()}`
}

export function calculateDailyRate(suite: Suite): number {
  return suite.weeklyRate / 7
}