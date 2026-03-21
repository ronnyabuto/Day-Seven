import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { BookingFlow } from './BookingFlow'
import { createBooking, getBlockedDates } from '@/app/actions'
import { SUITE_IDS } from '@/data/types'
import { Calendar } from "lucide-react" // Just importing to ensure lucide Mock isn't breaking stuff if any

// Mock server actions
jest.mock('@/app/actions', () => ({
    createBooking: jest.fn(),
    getBlockedDates: jest.fn(),
}))

// Mock UI components that might be heavy or complex
jest.mock('@/components/ui/calendar', () => ({
    Calendar: ({ onSelect }: any) => (
        <div data-testid="mock-calendar">
            <button onClick={() => onSelect({ from: new Date('2025-01-01'), to: new Date('2025-01-05') })}>
                Select Dates
            </button>
        </div>
    ),
}))

jest.mock('@/components/ui/file-upload', () => ({
    FileUpload: ({ onChange }: any) => (
        <input
            data-testid="file-upload"
            type="file"
            onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
    ),
}))

jest.mock('@/components/ui/checkbox', () => ({
    Checkbox: ({ checked, onCheckedChange, id }: any) => (
        <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            data-testid="mock-checkbox"
            role="checkbox"
            aria-label="I agree to the House Rules"
        />
    ),
}))

const mockSuite = {
    id: 'nomad-suite',
    name: 'Nomad Suite',
    tagline: 'Deep Work Haven',
    image: '/placeholder.jpg',
    highlights: [],
    weeklyRate: 50000,
    monthlyRate: 150000,
    icon: Calendar, // dummy icon
    available: true,
    colorTemp: 'neutral' as const,
    lastBooked: '2 days ago',
}

describe('BookingFlow Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks()
            ; (getBlockedDates as jest.Mock).mockResolvedValue([])
            ; (createBooking as jest.Mock).mockResolvedValue({ success: true, bookingId: '123' })
    })

    test('Complete Booking Flow Success', async () => {
        render(<BookingFlow suite={mockSuite} />)

        // 1. Date Selection
        await waitFor(() => expect(screen.getByTestId('mock-calendar')).toBeInTheDocument())
        fireEvent.click(screen.getByText('Select Dates'))

        // Check summary appears
        expect(screen.getByText('Continue booking')).toBeInTheDocument()
        fireEvent.click(screen.getByText('Continue booking'))

        // 2. Guest Info Form
        expect(screen.getByText('Guest information')).toBeInTheDocument()

        // Fill form
        fireEvent.change(screen.getByLabelText(/Full name/i), { target: { value: 'Test User' } })
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } })
        fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '+254700000000' } })

        // Upload ID
        const file = new File(['dummy'], 'id.png', { type: 'image/png' })
        const fileInput = screen.getByTestId('file-upload')
        fireEvent.change(fileInput, { target: { files: [file] } })

        // Agree to rules (Checkbox)
        // Note: Checking usage of Radix checkbox or native. 
        // If it's the custom component, fireEvent.click might be better than change if it's a div/button
        // We'll try finding the checkbox. In our code it is <Checkbox id="rules" ...>. 
        // The label "I agree to the House Rules" is associated.
        const rulesCheckbox = screen.getByRole('checkbox', { name: /I agree to the House Rules/i })
        fireEvent.click(rulesCheckbox)

        // Submit
        const submitBtn = screen.getByText('Confirm & Pay')
        expect(submitBtn).not.toBeDisabled()

        await act(async () => {
            fireEvent.click(submitBtn)
        })

        // Assert createBooking called with verifiedId true
        expect(createBooking).toHaveBeenCalledWith(expect.objectContaining({
            suiteId: 'nomad-suite',
            verifiedId: true,
            guestName: 'Test User'
        }))

        // 3. Confirmation
        await waitFor(() => {
            expect(screen.getByText(/Booking confirmed/i)).toBeInTheDocument()
        })
        // Check M-Pesa prompt logic implicitly via text presence
        expect(screen.getByText(/check your phone/i)).toBeInTheDocument()
    })

    test('Fails on server error', async () => {
        (createBooking as jest.Mock).mockResolvedValue({ success: false, error: 'Simulated failure' })
        window.alert = jest.fn() // Mock alert

        render(<BookingFlow suite={mockSuite} />)

        // Fast forward to submit (Using helper setup would be better but copy-paste for speed)
        // 1. Dates
        fireEvent.click(screen.getByText('Select Dates'))
        fireEvent.click(screen.getByText('Continue booking'))

        // 2. Info
        fireEvent.change(screen.getByLabelText(/Full name/i), { target: { value: 'Test User' } })
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } })
        fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '+254700000000' } })
        const fileInput = screen.getByTestId('file-upload')
        fireEvent.change(fileInput, { target: { files: [new File([''], 'id.png', { type: 'image/png' })] } })
        fireEvent.click(screen.getByRole('checkbox', { name: /I agree to the House Rules/i }))

        // Submit
        await act(async () => {
            fireEvent.click(screen.getByText('Confirm & Pay'))
        })

        expect(createBooking).toHaveBeenCalled()
        expect(window.alert).toHaveBeenCalledWith('Simulated failure')
        // Should NOT be on confirmation page
        expect(screen.queryByText(/Booking confirmed/i)).not.toBeInTheDocument()
    })
})
