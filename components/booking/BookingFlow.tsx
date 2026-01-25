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
import { createBooking, getBlockedDates } from "@/app/actions"

// Extend React namespace for useTransition if needed or just use React.useTransition
// but BookingFlow is already using React.memo, so React.useTransition is fine.

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

  const [isPending, startTransition] = React.useTransition()
  const [blockedDates, setBlockedDates] = React.useState<{ from: Date; to: Date }[]>([])

  React.useEffect(() => {
    if (suite.id) {
      getBlockedDates(suite.id).then(setBlockedDates)
    }
  }, [suite.id])

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
                blockedDates={blockedDates}
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
                startTransition(async () => {
                  const startDate = suite.isHourly
                    ? new Date()
                    : selectedDates.from || new Date()

                  const endDate = suite.isHourly
                    ? new Date(startDate.getTime() + selectedHours * 60 * 60 * 1000)
                    : selectedDates.to || new Date()

                  const result = await createBooking({
                    suiteId: suite.id,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    guestName: guestInfo.name,
                    guestEmail: guestInfo.email,
                    guestPhone: guestInfo.phone,
                    totalAmount: rate,
                    verifiedId: !!guestInfo.idFile,
                  })

                  if (result.success) {
                    nextStep()
                  } else {
                    alert(result.error || "Failed to create booking")
                  }
                })
              }
            }}
            onBack={previousStep}
            isValid={isGuestInfoComplete}
            isPending={isPending}
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