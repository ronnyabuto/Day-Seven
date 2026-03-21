'use server'

import { z } from 'zod'
import { adminClient } from '@/lib/supabase/admin'
import { resend } from '@/lib/email'
import { env } from '@/lib/env'
import { initiateSTKPush } from '@/lib/mpesa'
import { suites } from '@/data/suites'
import { calculateStay } from '@/utils/pricing'

const bookingSchema = z.object({
    suiteId: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    guestName: z.string().min(2),
    guestEmail: z.string().email(),
    guestPhone: z.string(),
    verifiedId: z.boolean().optional(),
    selectedHours: z.number().optional(),
})

export type BookingState = {
    success: boolean
    message?: string
    bookingId?: string
    error?: string
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

export async function createBooking(data: z.infer<typeof bookingSchema>) {
    console.log("Creating booking:", data)

    const validation = bookingSchema.safeParse(data)
    if (!validation.success) {
        return { success: false, error: "Invalid booking data" }
    }

    if (!adminClient) {
        return { success: false, error: 'Booking system temporarily unavailable. Please contact us directly.' }
    }

    const suite = suites.find(s => s.id === validation.data.suiteId)
    if (!suite) return { success: false, error: 'Invalid suite' }
    const dates = { from: new Date(validation.data.startDate), to: new Date(validation.data.endDate) }
    const authoritative = calculateStay(suite, dates, validation.data.selectedHours ?? 1)
    const totalAmount = authoritative.rate

    try {
        let checkoutRequestId = null
        if (env.MPESA.CONSUMER_KEY && totalAmount > 0) {
            try {
                const mpesaResponse = await initiateSTKPush({
                    phone: data.guestPhone,
                    amount: totalAmount,
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

        const { data: booking, error } = await adminClient
            .from('bookings')
            .insert({
                suite_id: data.suiteId,
                guest_name: data.guestName,
                guest_email: data.guestEmail,
                guest_phone: data.guestPhone,
                start_date: data.startDate,
                end_date: data.endDate,
                total_amount: totalAmount,
                status: 'pending',
                metadata: {
                    verified_id: data.verifiedId,
                    mpesa_checkout_id: checkoutRequestId
                }
            })
            .select()
            .single() // adminClient uses the service role key and bypasses RLS

        if (error) {
            console.error("Supabase error:", error)
            return { success: false, error: "Failed to save booking. Please try again." }
        }
        const bookingId = booking?.id

        if (resend) {
            const hostEmail = env.RESEND.FROM_EMAIL || 'onboarding@resend.dev'

            await resend.emails.send({
                from: hostEmail,
                to: env.BUSINESS.EMAIL,
                subject: `New Booking: ${data.guestName} - ${data.suiteId}`,
                html: `
          <h1>New Booking Request</h1>
          <p><strong>Guest:</strong> ${escapeHtml(data.guestName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(data.guestEmail)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(data.guestPhone)}</p>
          <p><strong>Suite:</strong> ${escapeHtml(data.suiteId)}</p>
          <p><strong>Dates:</strong> ${new Date(data.startDate).toDateString()} - ${new Date(data.endDate).toDateString()}</p>
          <p><strong>ID Verified:</strong> ${data.verifiedId ? "Yes (File Uploaded)" : "No"}</p>
          <p><strong>Booking ID:</strong> ${escapeHtml(String(bookingId))}</p>
        `
            })

            // Send to Guest
            await resend.emails.send({
                from: hostEmail,
                to: data.guestEmail,
                subject: `Booking Request Received: Day Seven - ${data.suiteId}`,
                html: `
          <h1>Request Received</h1>
          <p>Hi ${escapeHtml(data.guestName)},</p>
          <p>We've received your booking request for the <strong>${escapeHtml(data.suiteId)}</strong>.</p>
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
