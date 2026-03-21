import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import type { DateRange, Suite } from "@/data/types"
import { calculateStay, formatCurrency } from "@/utils/pricing"

interface DateSelectionProps {
  suite: Suite
  selectedDates: DateRange
  onDatesChange: (dates: DateRange) => void
  onNext: () => void
  blockedDates?: { from: Date; to: Date }[]
}

export function DateSelection({
  suite,
  selectedDates,
  onDatesChange,
  onNext,
  blockedDates
}: DateSelectionProps) {
  const { days, rate, discount } = calculateStay(suite, selectedDates)
  const isValidSelection = selectedDates.from && selectedDates.to

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground text-xl">
            {days > 0 ? `${days} nights` : 'Select dates'}
          </h3>
          <p className="text-muted-foreground text-sm">
            {selectedDates.from && selectedDates.to ?
              `${selectedDates.from.toLocaleDateString()} - ${selectedDates.to.toLocaleDateString()}` :
              'Add your travel dates for exact pricing'}
          </p>
        </div>
        <div className="flex border border-white/20 rounded-xl overflow-hidden bg-white/5">
          <div className="px-4 py-2 border-r border-white/20">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Check-in</div>
            <div className="text-sm font-medium">{selectedDates.from ? selectedDates.from.toLocaleDateString() : 'Add date'}</div>
          </div>
          <div className="px-4 py-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Checkout</div>
            <div className="text-sm font-medium">{selectedDates.to ? selectedDates.to.toLocaleDateString() : 'Add date'}</div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-0 sm:p-2 border border-white/10 shadow-lg shadow-black/5 overflow-hidden">
        <div className="flex justify-center">
          <Calendar
            mode="range"
            selected={selectedDates as any}
            onSelect={(range) => onDatesChange(range || {})}
            className="rounded-md border-0 bg-transparent"
            disabled={[
              { from: new Date(1900, 0, 1), to: new Date(new Date().setHours(0, 0, 0, 0)) },
              ...(blockedDates || [])
            ]}
            numberOfMonths={2}
          />
        </div>
      </div>

      {isValidSelection && (
        <BookingSummary
          days={days}
          rate={rate}
          discount={discount}
          onNext={onNext}
        />
      )}
    </div>
  )
}

interface BookingSummaryProps {
  days: number
  rate: number
  discount: number
  onNext: () => void
}

function BookingSummary({ days, rate, discount, onNext }: BookingSummaryProps) {
  return (
    <>
      {/* Desktop Summary */}
      <div className="hidden sm:block space-y-4 pt-6 border-t border-white/20">
        <SummaryContent days={days} rate={rate} discount={discount} onNext={onNext} />
      </div>

      {/* Mobile Sticky Footer */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-white/10 z-50 animate-in slide-in-from-bottom-5">
        <SummaryContent days={days} rate={rate} discount={discount} onNext={onNext} isMobile />
      </div>
    </>
  )
}

function SummaryContent({ days, rate, discount, onNext, isMobile }: any) {
  return (
    <div className={isMobile ? "flex items-center justify-between gap-4" : "space-y-4"}>
      <div className={isMobile ? "flex-1" : "flex justify-between text-base font-medium"}>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold">{formatCurrency(rate)}</span>
          {isMobile && <span className="text-sm text-muted-foreground">total</span>}
        </div>
        {!isMobile && <span>{days} nights</span>}
        {discount > 0 && !isMobile && (
          <div className="text-sm text-emerald-400 mt-1">
            Included {(discount * 100).toFixed(0)}% discount
          </div>
        )}
      </div>

      {/* Mobile-specific detail text if needed */}
      {isMobile && discount > 0 && (
        <div className="hidden">
          {/* Hidden on mobile summary line for simplicity, or could add a small badge */}
        </div>
      )}

      <Button
        onClick={onNext}
        className={`${isMobile ? 'w-auto px-8' : 'w-full'} bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl shadow-lg shadow-primary/25`}
      >
        Continue
      </Button>
    </div>
  )
}