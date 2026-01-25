import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { FileUpload } from "@/components/ui/file-upload"
import type { GuestInfo } from "@/data/types"

interface GuestFormProps {
  guestInfo: GuestInfo
  validationErrors: Record<string, string | undefined>
  onInputChange: (field: keyof GuestInfo, value: any) => void
  onInputBlur: (field: keyof GuestInfo, value: any) => void
  onNext: () => void
  onBack: () => void
  isValid: boolean
  isPending?: boolean
}

export function GuestForm({
  guestInfo,
  validationErrors,
  onInputChange,
  onInputBlur,
  onNext,
  onBack,
  isValid,
  isPending = false,
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

        <div className="pt-2">
          <FileUpload
            label="Government ID / Passport"
            value={guestInfo.idFile}
            onChange={(file) => onInputChange('idFile', file)}
            error={validationErrors.idFile}
          />
        </div>

        <div className="flex items-start space-x-3 pt-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <Checkbox
            id="rules"
            checked={guestInfo.agreedToRules}
            onCheckedChange={(checked) => {
              onInputChange('agreedToRules', checked === true)
            }}
            className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary border-white/30"
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="rules"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              I agree to the House Rules
            </Label>
            <p className="text-sm text-muted-foreground">
              No parties, no smoking inside. Quiet hours 10pm-7am.
              Strict verification required for check-in.
            </p>
            {validationErrors.agreedToRules && (
              <p className="text-sm text-red-500 mt-1">
                {validationErrors.agreedToRules}
              </p>
            )}
          </div>
        </div>
      </div>

      <FormActions
        onNext={onNext}
        onBack={onBack}
        isValid={isValid}
        isPending={isPending}
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
        className={`mt-1 bg-white/10 backdrop-blur-sm border-white/20 rounded-xl shadow-lg shadow-black/5 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
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
  isPending?: boolean
}

function FormActions({ onNext, onBack, isValid, isPending }: FormActionsProps) {
  return (
    <div className="flex gap-3 pt-4">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={isPending}
        className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 rounded-xl shadow-lg shadow-black/5 hover:bg-white/20 transition-all duration-300"
      >
        Back
      </Button>
      <Button
        onClick={onNext}
        disabled={!isValid || isPending}
        className="flex-1 bg-primary/90 hover:bg-primary backdrop-blur-sm text-primary-foreground transition-all duration-300 hover:scale-[1.02] rounded-xl shadow-lg shadow-primary/20 border border-white/20"
      >
        {isPending ? "Processing..." : "Confirm & Pay"}
      </Button>
    </div>
  )
}