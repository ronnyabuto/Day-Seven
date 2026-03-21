import { z } from "zod"

/**
 * Form validation schemas using Zod
 * Provides type-safe validation for all form inputs
 */

// Guest information validation schema
export const guestInfoSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(254, "Email must not exceed 254 characters"),
  
  phone: z
    .string()
    .regex(
      /^\+?[1-9]\d{9,14}$/,
      "Please enter a valid phone number (e.g., +254700000000 or 0700000000)"
    )
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits"),
})

// Date range validation schema
export const dateRangeSchema = z.object({
  from: z.date().min(new Date(), "Check-in date must be in the future"),
  to: z.date(),
}).refine((data) => {
  if (data.to <= data.from) {
    return false
  }
  return true
}, {
  message: "Check-out date must be after check-in date",
  path: ["to"],
})

// Hourly booking validation schema
export const hourlyBookingSchema = z.object({
  hours: z
    .number()
    .int("Hours must be a whole number")
    .min(1, "Minimum booking is 1 hour")
    .max(12, "Maximum booking is 12 hours"),
})

// Suite selection validation schema
export const suiteSelectionSchema = z.object({
  suiteId: z
    .string()
    .min(1, "Please select a suite")
    .refine((id) => ["nomad", "minimalist", "wellness", "pause"].includes(id), {
      message: "Invalid suite selection",
    }),
})

// Complete booking validation schema
export const bookingSchema = z.object({
  suite: suiteSelectionSchema,
  guestInfo: guestInfoSchema,
}).and(
  z.union([
    dateRangeSchema,
    hourlyBookingSchema,
  ])
)

// Type exports for TypeScript
export type GuestInfo = z.infer<typeof guestInfoSchema>
export type DateRange = z.infer<typeof dateRangeSchema>
export type HourlyBooking = z.infer<typeof hourlyBookingSchema>
export type SuiteSelection = z.infer<typeof suiteSelectionSchema>
export type Booking = z.infer<typeof bookingSchema>

/**
 * Utility function to validate and return typed errors
 */
export function validateGuestInfo(data: unknown): { success: true; data: GuestInfo } | { success: false; errors: string[] } {
  const result = guestInfoSchema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  return {
    success: false,
    errors: result.error.errors.map(err => err.message)
  }
}

/**
 * Phone number formatter utility
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '')
  
  // If it starts with 0, replace with +254
  if (cleaned.startsWith('0')) {
    return '+254' + cleaned.slice(1)
  }
  
  // If it doesn't start with +, add +254
  if (!cleaned.startsWith('+')) {
    return '+254' + cleaned
  }
  
  return cleaned
}

/**
 * Email validation utility (more permissive than zod for real-time validation)
 */
export function isValidEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}