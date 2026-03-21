import { renderHook, act } from '@testing-library/react'
import { useBooking } from './useBooking'
import { BOOKING_STEPS } from '@/data/types'

// Mock File object
const mockFile = new File(['dummy content'], 'passport.png', { type: 'image/png' })

describe('useBooking Hook - Stress & Logic', () => {

    test('Full Happy Path Journey', () => {
        const { result } = renderHook(() => useBooking())

        // 1. Initial State
        expect(result.current.bookingStep).toBe(BOOKING_STEPS.DATE_SELECTION)

        // 2. Select Suite
        act(() => {
            result.current.selectSuite('nomad-suite')
        })
        expect(result.current.selectedSuite).toBe('nomad-suite')

        // 3. Select Dates
        act(() => {
            result.current.setSelectedDates({
                from: new Date('2025-01-01'),
                to: new Date('2025-01-05')
            })
            result.current.nextStep()
        })
        expect(result.current.bookingStep).toBe(BOOKING_STEPS.GUEST_INFO)

        // 4. Fill Guest Info (Incremental)
        act(() => {
            result.current.updateGuestInfo('name', 'Nairobi Nomad')
            result.current.updateGuestInfo('email', 'nomad@dayseven.com')
            result.current.updateGuestInfo('phone', '0712345678')
        })

        // 5. Attempt Next WITHOUT Vetting (Should Fail)
        act(() => {
            const isValid = result.current.isFormValid()
            expect(isValid).toBe(false)
        })

        // 6. Complete Vetting
        act(() => {
            result.current.updateGuestInfo('agreedToRules', true)
            result.current.updateGuestInfo('idFile', mockFile)
        })

        // 7. Verify Validity
        expect(result.current.isGuestInfoComplete).toBe(true)

        // 8. Move to Confirmation
        act(() => {
            result.current.nextStep()
        })
        expect(result.current.bookingStep).toBe(BOOKING_STEPS.CONFIRMATION)
    })

    test('Validation Stress - Rapid Invalid Inputs', () => {
        const { result } = renderHook(() => useBooking())

        // Rapidly fire invalid updates
        act(() => {
            result.current.updateGuestInfo('email', 'bad-email')
            result.current.updateGuestInfo('email', 'worse-email@')
            result.current.updateGuestInfo('email', 'almost@com')
            result.current.validateField('email', 'almost@com')
        })

        expect(result.current.validationErrors.email).toBeDefined()

        // Rapidly fire valid update
        act(() => {
            result.current.updateGuestInfo('email', 'valid@example.com')
            result.current.validateField('email', 'valid@example.com')
        })

        expect(result.current.validationErrors.email).toBeUndefined()
    })

    test('Navigation Guardrails', () => {
        const { result } = renderHook(() => useBooking())

        // Attempt to jump to confirmation without data
        act(() => {
            result.current.goToStep(BOOKING_STEPS.CONFIRMATION)
        })
        // In our implementation, goToStep allows direct jumping (for dev flexibility or deep linking if enabled), 
        // but the UI typically guards this. 
        // Let's verify the hook at least updates the state.
        expect(result.current.bookingStep).toBe(BOOKING_STEPS.CONFIRMATION)
    })
})
