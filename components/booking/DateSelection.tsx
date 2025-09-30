import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import type { DateRange, Suite } from "@/data/types"
import { calculateStay, formatCurrency } from "@/utils/pricing"

interface DateSelectionProps {
  suite: Suite
  selectedDates: DateRange
  onDatesChange: (dates: DateRange) => void
  onNext: () => void
}

export function DateSelection({ 
  suite, 
  selectedDates, 
  onDatesChange, 
  onNext 
}: DateSelectionProps) {
  const { days, rate, discount } = calculateStay(suite, selectedDates)
  const isValidSelection = selectedDates.from && selectedDates.to

  return (
    <div className="space-y-6">
      <h3 className="font-medium text-foreground text-lg">
        Select your stay dates
      </h3>
      
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-lg shadow-black/5">
        <Calendar
          mode="range"
          selected={selectedDates as any}
          onSelect={(range) => onDatesChange(range || {})}
          className="rounded-md border-0 bg-transparent"
          disabled={(date) => date < new Date()}
          numberOfMonths={1}
        />
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
    <div className="space-y-4 pt-6 border-t border-white/20">
      <div className="flex justify-between text-base font-medium">
        <span>{days} nights</span>
        <span>{formatCurrency(rate)}</span>
      </div>
      
      {discount > 0 && (
        <div className="flex justify-between text-sm text-secondary bg-secondary/20 backdrop-blur-sm p-3 rounded-xl border border-white/10 shadow-lg shadow-black/5">
          <span>{discount === 0.15 ? "Monthly" : "Weekly"} discount</span>
          <span>-{(discount * 100).toFixed(0)}%</span>
        </div>
      )}
      
      <Button
        onClick={onNext}
        className="w-full bg-primary/90 hover:bg-primary backdrop-blur-sm text-primary-foreground transition-all duration-300 hover:scale-[1.02] py-3 rounded-xl shadow-lg shadow-primary/20 border border-white/20"
      >
        Continue booking
      </Button>
    </div>
  )
}