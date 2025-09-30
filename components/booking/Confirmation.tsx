import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import type { GuestInfo, Suite } from "@/data/types"

interface ConfirmationProps {
  suite: Suite
  guestInfo: GuestInfo
  duration: {
    days?: number
    hours?: number
  }
  onNewBooking: () => void
}

export function Confirmation({ 
  suite, 
  guestInfo, 
  duration, 
  onNewBooking 
}: ConfirmationProps) {
  const durationText = suite.isHourly 
    ? `${duration.hours} hour${duration.hours && duration.hours > 1 ? "s" : ""}`
    : `${duration.days} nights`

  return (
    <div className="space-y-4 text-center">
      <ConfirmationIcon />
      
      <h3 className="font-medium text-foreground">
        Booking confirmed
      </h3>
      
      <p className="text-sm text-muted-foreground">
        Thank you, {guestInfo.name}. Your reservation for{" "}
        {durationText} has been confirmed. You'll receive a confirmation email shortly.
      </p>
      
      <Button
        onClick={onNewBooking}
        variant="outline"
        className="w-full bg-white/10 backdrop-blur-sm border-white/20 rounded-xl shadow-lg shadow-black/5 hover:bg-white/20 transition-all duration-300"
      >
        Book another stay
      </Button>
    </div>
  )
}

function ConfirmationIcon() {
  return (
    <div className="w-12 h-12 bg-secondary/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto animate-pulse shadow-lg shadow-secondary/20 border border-white/20">
      <Shield className="w-6 h-6 text-secondary-foreground" />
    </div>
  )
}