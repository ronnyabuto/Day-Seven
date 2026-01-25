/**
 * Environment variables configuration
 * Type-safe access to environment variables with validation
 */

function validateEnv(value: string | undefined, name: string, defaultValue?: string): string {
  const finalValue = value || defaultValue
  if (!finalValue) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return finalValue
}

export const env = {
  // Application
  APP_URL: validateEnv(process.env.NEXT_PUBLIC_APP_URL, 'NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  APP_NAME: validateEnv(process.env.NEXT_PUBLIC_APP_NAME, 'NEXT_PUBLIC_APP_NAME', 'Day Seven'),
  APP_DESCRIPTION: validateEnv(process.env.NEXT_PUBLIC_APP_DESCRIPTION, 'NEXT_PUBLIC_APP_DESCRIPTION', 'Quiet. Modern. Yours.'),

  // Contact
  CONTACT_EMAIL: validateEnv(process.env.NEXT_PUBLIC_CONTACT_EMAIL, 'NEXT_PUBLIC_CONTACT_EMAIL', 'hello@dayseven.com'),
  CONTACT_PHONE: validateEnv(process.env.NEXT_PUBLIC_CONTACT_PHONE, 'NEXT_PUBLIC_CONTACT_PHONE', '+254 700 000 000'),

  // Social Media
  SOCIAL: {
    INSTAGRAM: validateEnv(process.env.NEXT_PUBLIC_INSTAGRAM_URL, 'NEXT_PUBLIC_INSTAGRAM_URL', 'https://instagram.com/daysevennairobi'),
    TWITTER: validateEnv(process.env.NEXT_PUBLIC_TWITTER_URL, 'NEXT_PUBLIC_TWITTER_URL', 'https://twitter.com/daysevennairobi'),
    LINKEDIN: validateEnv(process.env.NEXT_PUBLIC_LINKEDIN_URL, 'NEXT_PUBLIC_LINKEDIN_URL', 'https://linkedin.com/company/daysevennairobi'),
    TIKTOK: validateEnv(process.env.NEXT_PUBLIC_TIKTOK_URL, 'NEXT_PUBLIC_TIKTOK_URL', 'https://tiktok.com/@daysevennairobi'),
  },

  // SEO
  SEO: {
    GOOGLE_VERIFICATION: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION_CODE || '',
    SITE_URL: validateEnv(process.env.NEXT_PUBLIC_SITE_URL, 'NEXT_PUBLIC_SITE_URL', 'https://nairobiexecutivestays.com'),
    TWITTER_HANDLE: validateEnv(process.env.NEXT_PUBLIC_TWITTER_HANDLE, 'NEXT_PUBLIC_TWITTER_HANDLE', '@nairobiexecutive'),
  },

  // Business
  BUSINESS: {
    NAME: validateEnv(process.env.NEXT_PUBLIC_BUSINESS_NAME, 'NEXT_PUBLIC_BUSINESS_NAME', 'Nairobi Executive Stays'),
    EMAIL: validateEnv(process.env.NEXT_PUBLIC_BUSINESS_EMAIL, 'NEXT_PUBLIC_BUSINESS_EMAIL', 'hello@nairobiexecutivestays.com'),
    PHONE: validateEnv(process.env.NEXT_PUBLIC_BUSINESS_PHONE, 'NEXT_PUBLIC_BUSINESS_PHONE', '+254700000000'),
    LOCATION: validateEnv(process.env.NEXT_PUBLIC_BUSINESS_LOCATION, 'NEXT_PUBLIC_BUSINESS_LOCATION', 'Kilimani, Nairobi'),
    LATITUDE: parseFloat(validateEnv(process.env.NEXT_PUBLIC_BUSINESS_LATITUDE, 'NEXT_PUBLIC_BUSINESS_LATITUDE', '-1.2921')),
    LONGITUDE: parseFloat(validateEnv(process.env.NEXT_PUBLIC_BUSINESS_LONGITUDE, 'NEXT_PUBLIC_BUSINESS_LONGITUDE', '36.8219')),
  },

  // Images
  IMAGES: {
    NOMAD_SUITE: validateEnv(process.env.NEXT_PUBLIC_NOMAD_SUITE_IMAGE, 'NEXT_PUBLIC_NOMAD_SUITE_IMAGE', '/modern-minimalist-workspace-with-large-monitor-and.png'),
    MINIMALIST_SUITE: validateEnv(process.env.NEXT_PUBLIC_MINIMALIST_SUITE_IMAGE, 'NEXT_PUBLIC_MINIMALIST_SUITE_IMAGE', '/minimalist-bedroom-with-neutral-colors-and-natural.png'),
    WELLNESS_SUITE: validateEnv(process.env.NEXT_PUBLIC_WELLNESS_SUITE_IMAGE, 'NEXT_PUBLIC_WELLNESS_SUITE_IMAGE', '/wellness-room-with-plants-yoga-mat-and-natural-lig.png'),
    PAUSE_SUITE: validateEnv(process.env.NEXT_PUBLIC_PAUSE_SUITE_IMAGE, 'NEXT_PUBLIC_PAUSE_SUITE_IMAGE', '/reset-ritual-wooden-tray-with-tea-and-snacks.png'),
  },

  // Supabase
  SUPABASE: {
    URL: validateEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL'),
    ANON_KEY: validateEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },

  // Resend
  RESEND: {
    API_KEY: process.env.RESEND_API_KEY || '',
    FROM_EMAIL: process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL || 'onboarding@resend.dev',
  },

  // M-Pesa
  MPESA: {
    CONSUMER_KEY: process.env.MPESA_CONSUMER_KEY || '',
    CONSUMER_SECRET: process.env.MPESA_CONSUMER_SECRET || '',
    PASSKEY: process.env.MPESA_PASSKEY || '',
    SHORTCODE: process.env.MPESA_SHORTCODE || '',
    CALLBACK_URL: process.env.MPESA_CALLBACK_URL || '',
    ENV: process.env.MPESA_ENV || 'sandbox',
  },
} as const

// Type exports for better TypeScript support
export type Environment = typeof env