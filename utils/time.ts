/**
 * Time-related utility functions
 * Pure functions for time calculations and formatting
 */

export function getCurrentTime(): Date {
  return new Date()
}

export function isEvening(time: Date = getCurrentTime()): boolean {
  const hour = time.getHours()
  return hour >= 18 || hour < 6
}

export function formatTimeAgo(timeString: string): string {
  return timeString
}

export function isDateInFuture(date: Date): boolean {
  return date > getCurrentTime()
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateRange(from: Date, to: Date): string {
  const fromStr = formatDate(from)
  const toStr = formatDate(to)
  
  if (isSameDay(from, to)) {
    return fromStr
  }
  
  return `${fromStr} - ${toStr}`
}