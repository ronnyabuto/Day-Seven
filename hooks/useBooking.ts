import { useState, useCallback } from "react"
import type { BookingState, GuestInfo, DateRange, Suite } from "@/data/types"
import { BOOKING_STEPS } from "@/data/types"
import { validateGuestInfo, formatPhoneNumber, isValidEmailFormat } from "@/lib/validations"

/**
 * Custom hook for booking flow state management
 * Encapsulates all booking-related state and logic
 */

const initialGuestInfo: GuestInfo = {
  name: "",
  email: "",
  phone: "",
}

const initialBookingState: BookingState = {
  selectedSuite: null,
  bookingStep: BOOKING_STEPS.DATE_SELECTION,
  selectedDates: {},
  guestInfo: initialGuestInfo,
  selectedHours: 1,
  validationErrors: {},
}

export function useBooking() {
  const [bookingState, setBookingState] = useState<BookingState>(initialBookingState)

  // Suite selection
  const selectSuite = useCallback((suiteId: string) => {
    setBookingState(prev => ({
      ...prev,
      selectedSuite: suiteId,
      bookingStep: BOOKING_STEPS.DATE_SELECTION,
    }))
  }, [])

  // Date selection
  const setSelectedDates = useCallback((dates: DateRange) => {
    setBookingState(prev => ({
      ...prev,
      selectedDates: dates,
    }))
  }, [])

  // Hours selection for hourly bookings
  const setSelectedHours = useCallback((hours: number) => {
    setBookingState(prev => ({
      ...prev,
      selectedHours: hours,
    }))
  }, [])

  // Guest info management with validation
  const updateGuestInfo = useCallback((field: keyof GuestInfo, value: string) => {
    let processedValue = value
    
    // Auto-format phone numbers
    if (field === 'phone') {
      processedValue = formatPhoneNumber(value)
    }

    setBookingState(prev => ({
      ...prev,
      guestInfo: {
        ...prev.guestInfo,
        [field]: processedValue,
      },
      // Clear validation error when user starts typing
      validationErrors: {
        ...prev.validationErrors,
        [field]: undefined,
      },
    }))
  }, [])

  // Field validation
  const validateField = useCallback((field: keyof GuestInfo, value: string) => {
    const newErrors: Record<string, string> = {}
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required'
        } else if (value.length < 2) {
          newErrors.name = 'Name must be at least 2 characters'
        } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
          newErrors.name = 'Name can only contain letters, spaces, hyphens, and apostrophes'
        }
        break
      
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required'
        } else if (!isValidEmailFormat(value)) {
          newErrors.email = 'Please enter a valid email address'
        }
        break
      
      case 'phone':
        const formatted = formatPhoneNumber(value)
        if (!value.trim()) {
          newErrors.phone = 'Phone number is required'
        } else if (!/^\+?[1-9]\d{9,14}$/.test(formatted)) {
          newErrors.phone = 'Please enter a valid phone number'
        }
        break
    }
    
    setBookingState(prev => ({
      ...prev,
      validationErrors: {
        ...prev.validationErrors,
        ...newErrors,
      },
    }))
  }, [])

  // Form validation
  const isFormValid = useCallback((): boolean => {
    const validation = validateGuestInfo(bookingState.guestInfo)
    if (!validation.success) {
      const errors: Record<string, string> = {}
      validation.errors.forEach(error => {
        if (error.includes('Name')) errors.name = error
        if (error.includes('email')) errors.email = error
        if (error.includes('phone')) errors.phone = error
      })
      
      setBookingState(prev => ({
        ...prev,
        validationErrors: errors,
      }))
      return false
    }
    return Object.keys(bookingState.validationErrors).length === 0
  }, [bookingState.guestInfo, bookingState.validationErrors])

  // Navigation between booking steps
  const nextStep = useCallback(() => {
    setBookingState(prev => ({
      ...prev,
      bookingStep: Math.min(prev.bookingStep + 1, BOOKING_STEPS.CONFIRMATION),
    }))
  }, [])

  const previousStep = useCallback(() => {
    setBookingState(prev => ({
      ...prev,
      bookingStep: Math.max(prev.bookingStep - 1, BOOKING_STEPS.DATE_SELECTION),
    }))
  }, [])

  const goToStep = useCallback((step: number) => {
    setBookingState(prev => ({
      ...prev,
      bookingStep: step,
    }))
  }, [])

  // Reset booking state
  const resetBooking = useCallback(() => {
    setBookingState(initialBookingState)
  }, [])

  // Derived state
  const isGuestInfoComplete = 
    bookingState.guestInfo.name.trim() !== '' &&
    bookingState.guestInfo.email.trim() !== '' &&
    bookingState.guestInfo.phone.trim() !== '' &&
    Object.keys(bookingState.validationErrors).length === 0

  const isDatesSelected = 
    bookingState.selectedDates.from && bookingState.selectedDates.to

  return {
    // State
    ...bookingState,
    
    // Derived state
    isGuestInfoComplete,
    isDatesSelected,
    
    // Actions
    selectSuite,
    setSelectedDates,
    setSelectedHours,
    updateGuestInfo,
    validateField,
    isFormValid,
    nextStep,
    previousStep,
    goToStep,
    resetBooking,
  }
}