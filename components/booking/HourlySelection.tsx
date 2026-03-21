import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { calculateHourlyRate, formatCurrency } from "@/utils/pricing"

interface HourlySelectionProps {
  selectedHours: number
  onHoursChange: (hours: number) => void
  onNext: () => void
}

export function HourlySelection({ 
  selectedHours, 
  onHoursChange, 
  onNext 
}: HourlySelectionProps) {
  const rate = calculateHourlyRate(selectedHours)

  return (
    <div className="space-y-6">
      <h3 className="font-medium text-foreground text-lg">
        Select your hours
      </h3>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="hours" className="text-sm font-medium">
            Number of hours (1-12)
          </Label>
          <select
            id="hours"
            value={selectedHours}
            onChange={(e) => onHoursChange(Number(e.target.value))}
            className="w-full mt-2 p-3 border border-white/20 rounded-xl bg-white/10 backdrop-blur-sm text-sm shadow-lg shadow-black/5 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
              <option key={hour} value={hour}>
                {hour} hour{hour > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        
        <HourlySummary
          hours={selectedHours}
          rate={rate}
          onNext={onNext}
        />
      </div>
    </div>
  )
}

interface HourlySummaryProps {
  hours: number
  rate: number
  onNext: () => void
}

function HourlySummary({ hours, rate, onNext }: HourlySummaryProps) {
  return (
    <div className="space-y-4 pt-6 border-t border-white/20">
      <div className="flex justify-between text-base font-medium">
        <span>
          {hours} hour{hours > 1 ? "s" : ""}
        </span>
        <span>{formatCurrency(rate)}</span>
      </div>
      
      <div className="text-sm text-muted-foreground bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-lg shadow-black/5">
        Meals available every 6 hours from check-in
      </div>
      
      <Button
        onClick={onNext}
        className="w-full bg-primary/90 hover:bg-primary backdrop-blur-sm text-primary-foreground transition-all duration-300 hover:scale-[1.02] py-3 rounded-xl shadow-lg shadow-primary/20 border border-white/20"
      >
        Book by the Hour
      </Button>
    </div>
  )
}