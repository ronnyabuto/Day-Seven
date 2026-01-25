import { Resend } from 'resend'
import { env } from '@/lib/env'

export const resend = env.RESEND.API_KEY ? new Resend(env.RESEND.API_KEY) : null
