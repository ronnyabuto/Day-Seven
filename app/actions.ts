'use server'

import { z } from 'zod'
import { adminClient } from '@/lib/supabase/admin'
import { resend } from '@/lib/email'
import { env } from '@/lib/env'
import { initiateSTKPush } from '@/lib/mpesa'

const bookingSchema = z.object({
    suiteId: z.string(),
    startDate: z.string(), // ISO string
    endDate: z.string(),   // ISO string
    guestName: z.string().min(2),
    guestEmail: z.string().email(),
    guestPhone: z.string(),

    verifiedId: z.boolean().optional(),
    totalAmount: z.number().optional(),
})

export type BookingState = {
    success: boolean
    message?: string
    bookingId?: string
    error?: string
}

export async function submitBooking(prevState: any, formData: FormData): Promise<BookingState> {
    // Note: We are not using formData directly here if we call it as a function with JSON
    // But server actions as form actions receive FormData.
    // For tighter integration with our current React state, we might just call this as a function
    // rather than a form action. Let's make it a regular async function that takes an object.
    return { success: false, error: "Use submitBookingDirect instead" }
}

// Direct function call version (easier with non-form-based state like our DateRange)
export async function createBooking(data: z.infer<typeof bookingSchema>) {
    console.log("Creating booking:", data)

    const validation = bookingSchema.safeParse(data)
    if (!validation.success) {
        return { success: false, error: "Invalid booking data" }
    }

    try {
        // 0. Trigger M-Pesa Payment (If amount > 0)
        let checkoutRequestId = null
        if (env.MPESA.CONSUMER_KEY && data.totalAmount && data.totalAmount > 0) {
            try {
                const mpesaResponse = await initiateSTKPush({
                    phone: data.guestPhone,
                    amount: 1, // data.totalAmount, // Use 1 KES for testing
                    accountReference: data.suiteId,
                    transactionDesc: `Booking ${data.suiteId}`
                })
                checkoutRequestId = mpesaResponse.CheckoutRequestID
                console.log("M-Pesa initiated:", checkoutRequestId)
            } catch (err) {
                console.error("M-Pesa Error:", err)
                // Proceeding with booking but marking payment as failed/pending-manual
            }
        }

        let bookingId = `mock-${Date.now()}`

        // 1. Insert into Supabase (if configured)
        if (adminClient) {
            const { data: booking, error } = await adminClient
                .from('bookings')
                .insert({
                    suite_id: data.suiteId,
                    guest_name: data.guestName,
                    guest_email: data.guestEmail,
                    guest_phone: data.guestPhone,
                    start_date: data.startDate,
                    end_date: data.endDate,
                    total_amount: data.totalAmount,
                    status: 'pending',
                    // schema might need this column, but JSON metadata column is safer if schema not migrated
                    metadata: {
                        verified_id: data.verifiedId,
                        mpesa_checkout_id: checkoutRequestId
                    }
                })
                .select()
                .single() // Expecting single return if RLS/policies allow. 
            // Actually adminClient bypasses RLS so we can read it back.

            if (error) {
                console.error("Supabase error:", error)
                // Don't fail completely if DB fails in this prototype phase, 
                // unless we want strict behavior.
                // Let's return error but also log it.
                // For "Ghost Engine", we want to be robust.
                return { success: false, error: "Failed to save booking. Please try again." }
            }
            bookingId = booking?.id || bookingId
        } else {
            console.warn("Supabase not configured. Skipping DB insert.")
        }

        // 2. Send Email (if configured)
        if (resend) {
            const hostEmail = env.RESEND.FROM_EMAIL || 'onboarding@resend.dev'
            // Send to Host
            await resend.emails.send({
                from: hostEmail,
                to: env.BUSINESS.EMAIL, // configured in env
                subject: `New Booking: ${data.guestName} - ${data.suiteId}`,
                html: `
          <h1>New Booking Request</h1>
          <p><strong>Guest:</strong> ${data.guestName}</p>
          <p><strong>Email:</strong> ${data.guestEmail}</p>
          <p><strong>Phone:</strong> ${data.guestPhone}</p>
          <p><strong>Suite:</strong> ${data.suiteId}</p>
          <p><strong>Dates:</strong> ${new Date(data.startDate).toDateString()} - ${new Date(data.endDate).toDateString()}</p>
          <p><strong>ID Verified:</strong> ${data.verifiedId ? "Yes (File Uploaded)" : "No"}</p>
          <p><strong>Booking ID:</strong> ${bookingId}</p>
        `
            })

            // Send to Guest (Confirmation) - Optional for now
            await resend.emails.send({
                from: hostEmail,
                to: data.guestEmail,
                subject: `Booking Request Received: Day Seven - ${data.suiteId}`,
                html: `
          <h1>Request Received</h1>
          <p>Hi ${data.guestName},</p>
          <p>We've received your booking request for the <strong>${data.suiteId}</strong>.</p>
          <p>We are reviewing your details and will verify your identity shortly.</p>
          <br/>
          <p>Stay tuned,</p>
          <p>Day Seven Team</p>
        `
            })
        } else {
            console.warn("Resend not configured. Skipping email.")
        }

        return {
            success: true,
            bookingId,
            message: checkoutRequestId ? "Payment initiated. Please check your phone." : "Booking received."
        }
    } catch (error) {
        return { success: false, error: "An unexpected error occurred." }
    }
}


export async function getBookings() {
    if (!adminClient) return []

    try {
        const { data, error } = await adminClient
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    } catch (error) {
        console.error("Error fetching bookings:", error)
        return []
    }
}


export async function getBlockedDates(suiteId: string) {
    if (!adminClient) return []

    try {
        const { data, error } = await adminClient
            .from('bookings')
            .select('start_date, end_date')
            .eq('suite_id', suiteId)
            .in('status', ['confirmed', 'pending'])

        if (error) {
            console.error("Error fetching dates", error)
            return []
        }

        return data.map((b: any) => ({
            from: new Date(b.start_date),
            to: new Date(b.end_date)
        }))
    } catch (error) {
        console.error("Error in getBlockedDates", error)
        return []
    }
}
