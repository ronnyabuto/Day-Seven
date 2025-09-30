import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { DateSelection } from "./DateSelection"
import { HourlySelection } from "./HourlySelection"
import { GuestForm } from "./GuestForm"
import { Confirmation } from "./Confirmation"
import { useBooking } from "@/hooks/useBooking"
import type { Suite } from "@/data/types"
import { BOOKING_STEPS } from "@/data/types"
import { calculateStay } from "@/utils/pricing"

interface BookingFlowProps {
  suite: Suite
}

export const BookingFlow = React.memo(function BookingFlow({ suite }: BookingFlowProps) {
  const {
    bookingStep,
    selectedDates,
    selectedHours,
    guestInfo,
    validationErrors,
    isGuestInfoComplete,
    setSelectedDates,
    setSelectedHours,
    updateGuestInfo,
    validateField,
    isFormValid,
    nextStep,
    previousStep,
    resetBooking,
  } = useBooking()

  const stayCalculation = React.useMemo(() => 
    calculateStay(suite, selectedDates, selectedHours),
    [suite.id, suite.isHourly, suite.weeklyRate, suite.monthlyRate, selectedDates.from, selectedDates.to, selectedHours]
  )

  const { days, hours, rate } = stayCalculation

  return (
    <Card className="border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl shadow-black/10 rounded-2xl overflow-hidden">
      <CardContent className="p-6 sm:p-8">
        {bookingStep === BOOKING_STEPS.DATE_SELECTION && (
          <>
            {suite.isHourly ? (
              <HourlySelection
                selectedHours={selectedHours}
                onHoursChange={setSelectedHours}
                onNext={nextStep}
              />
            ) : (
              <DateSelection
                suite={suite}
                selectedDates={selectedDates}
                onDatesChange={setSelectedDates}
                onNext={nextStep}
              />
            )}
          </>
        )}

        {bookingStep === BOOKING_STEPS.GUEST_INFO && (
          <GuestForm
            guestInfo={guestInfo}
            validationErrors={validationErrors}
            onInputChange={updateGuestInfo}
            onInputBlur={validateField}
            onNext={() => {
              if (isFormValid()) {
                nextStep()
              }
            }}
            onBack={previousStep}
            isValid={isGuestInfoComplete}
          />
        )}

        {bookingStep === BOOKING_STEPS.CONFIRMATION && (
          <Confirmation
            suite={suite}
            guestInfo={guestInfo}
            duration={{ days, hours }}
            onNewBooking={resetBooking}
          />
        )}
      </CardContent>
    </Card>
  )
})