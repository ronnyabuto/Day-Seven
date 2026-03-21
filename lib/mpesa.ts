import { env } from '@/lib/env'

const BASE_URL = env.MPESA.ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke'

export async function getAccessToken() {
    const consumerKey = env.MPESA.CONSUMER_KEY
    const consumerSecret = env.MPESA.CONSUMER_SECRET

    if (!consumerKey || !consumerSecret) {
        throw new Error('M-Pesa Consumer Key or Secret not configured')
    }

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    try {
        const response = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
            method: 'GET',
            headers: {
                Authorization: `Basic ${auth}`,
            },
            cache: 'no-store',
            signal: controller.signal,
        })

        const data = await response.json()

        if (!response.ok) {
            console.error("M-Pesa Auth Error", data)
            throw new Error(data.errorMessage || 'Failed to authenticate with M-Pesa')
        }

        return data.access_token as string
    } catch (error) {
        console.error("M-Pesa Auth Exception", error)
        throw error
    } finally {
        clearTimeout(timeoutId)
    }
}

export async function initiateSTKPush({ phone, amount, accountReference = 'Day Seven', transactionDesc = 'Booking Payment' }: {
    phone: string,
    amount: number,
    accountReference?: string,
    transactionDesc?: string
}) {
    const token = await getAccessToken()

    // M-Pesa expects 254... format (remove leading + or replace leading 0 with 254)
    let formattedPhone = phone.replace(/^\+/, '').replace(/^0/, '254')

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14) // YYYYMMDDHHmmss
    const password = Buffer.from(
        `${env.MPESA.SHORTCODE}${env.MPESA.PASSKEY}${timestamp}`
    ).toString('base64')

    if (!env.MPESA.CALLBACK_URL) {
        throw new Error('MPESA_CALLBACK_URL is required. Payment processing cannot continue.')
    }

    const payload = {
        BusinessShortCode: env.MPESA.SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.ceil(amount),
        PartyA: formattedPhone,
        PartyB: env.MPESA.SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: env.MPESA.CALLBACK_URL,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc
    }

    console.log("Helper STK Push Payload:", { ...payload, Password: 'REDACTED' })

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    try {
        const response = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
        })

        const data = await response.json()
        console.log("M-Pesa STK Response:", data)

        return data
    } finally {
        clearTimeout(timeoutId)
    }
}
