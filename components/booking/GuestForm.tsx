import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { GuestInfo } from "@/data/types"

interface GuestFormProps {
  guestInfo: GuestInfo
  validationErrors: Record<string, string>
  onInputChange: (field: keyof GuestInfo, value: string) => void
  onInputBlur: (field: keyof GuestInfo, value: string) => void
  onNext: () => void
  onBack: () => void
  isValid: boolean
}

export function GuestForm({
  guestInfo,
  validationErrors,
  onInputChange,
  onInputBlur,
  onNext,
  onBack,
  isValid,
}: GuestFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-foreground">Guest information</h3>
      
      <LoadingIndicator />
      
      <div className="space-y-3">
        <FormField
          id="name"
          label="Full name"
          type="text"
          value={guestInfo.name}
          error={validationErrors.name}
          onChange={(value) => onInputChange('name', value)}
          onBlur={(value) => onInputBlur('name', value)}
        />
        
        <FormField
          id="email"
          label="Email"
          type="email"
          value={guestInfo.email}
          error={validationErrors.email}
          onChange={(value) => onInputChange('email', value)}
          onBlur={(value) => onInputBlur('email', value)}
        />
        
        <FormField
          id="phone"
          label="Phone"
          type="tel"
          placeholder="+254 700 000 000"
          value={guestInfo.phone}
          error={validationErrors.phone}
          onChange={(value) => onInputChange('phone', value)}
          onBlur={(value) => onInputBlur('phone', value)}
        />
      </div>
      
      <FormActions
        onNext={onNext}
        onBack={onBack}
        isValid={isValid}
      />
    </div>
  )
}

function LoadingIndicator() {
  return (
    <div className="flex justify-center mb-6">
      <div className="flex gap-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50" />
        <div
          className="w-2 h-2 bg-primary/50 rounded-full animate-pulse shadow-lg shadow-primary/30"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="w-2 h-2 bg-primary/30 rounded-full animate-pulse shadow-lg shadow-primary/20"
          style={{ animationDelay: "1s" }}
        />
      </div>
    </div>
  )
}

interface FormFieldProps {
  id: string
  label: string
  type: string
  placeholder?: string
  value: string
  error?: string
  onChange: (value: string) => void
  onBlur: (value: string) => void
}

function FormField({
  id,
  label,
  type,
  placeholder,
  value,
  error,
  onChange,
  onBlur,
}: FormFieldProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur(e.target.value)}
        className={`mt-1 bg-white/10 backdrop-blur-sm border-white/20 rounded-xl shadow-lg shadow-black/5 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
        }`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

interface FormActionsProps {
  onNext: () => void
  onBack: () => void
  isValid: boolean
}

function FormActions({ onNext, onBack, isValid }: FormActionsProps) {
  return (
    <div className="flex gap-3 pt-4">
      <Button
        variant="outline"
        onClick={onBack}
        className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 rounded-xl shadow-lg shadow-black/5 hover:bg-white/20 transition-all duration-300"
      >
        Back
      </Button>
      <Button
        onClick={onNext}
        disabled={!isValid}
        className="flex-1 bg-primary/90 hover:bg-primary backdrop-blur-sm text-primary-foreground transition-all duration-300 hover:scale-[1.02] rounded-xl shadow-lg shadow-primary/20 border border-white/20"
      >
        Confirm & Pay
      </Button>
    </div>
  )
}