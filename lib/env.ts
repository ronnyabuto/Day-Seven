/**
 * Environment variables configuration
 * Type-safe access to environment variables with validation
 */

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function getOptionalEnvVar(name: string, defaultValue: string = ''): string {
  return process.env[name] || defaultValue
}

export const env = {
  // Application
  APP_URL: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  APP_NAME: getEnvVar('NEXT_PUBLIC_APP_NAME', 'Day Seven'),
  APP_DESCRIPTION: getEnvVar('NEXT_PUBLIC_APP_DESCRIPTION', 'Quiet. Modern. Yours.'),

  // Contact
  CONTACT_EMAIL: getEnvVar('NEXT_PUBLIC_CONTACT_EMAIL', 'hello@dayseven.com'),
  CONTACT_PHONE: getEnvVar('NEXT_PUBLIC_CONTACT_PHONE', '+254 700 000 000'),

  // Social Media
  SOCIAL: {
    INSTAGRAM: getEnvVar('NEXT_PUBLIC_INSTAGRAM_URL', 'https://instagram.com/daysevennairobi'),
    TWITTER: getEnvVar('NEXT_PUBLIC_TWITTER_URL', 'https://twitter.com/daysevennairobi'),
    LINKEDIN: getEnvVar('NEXT_PUBLIC_LINKEDIN_URL', 'https://linkedin.com/company/daysevennairobi'),
    TIKTOK: getEnvVar('NEXT_PUBLIC_TIKTOK_URL', 'https://tiktok.com/@daysevennairobi'),
  },

  // SEO
  SEO: {
    GOOGLE_VERIFICATION: getOptionalEnvVar('NEXT_PUBLIC_GOOGLE_VERIFICATION_CODE'),
    SITE_URL: getEnvVar('NEXT_PUBLIC_SITE_URL', 'https://nairobiexecutivestays.com'),
    TWITTER_HANDLE: getEnvVar('NEXT_PUBLIC_TWITTER_HANDLE', '@nairobiexecutive'),
  },

  // Business
  BUSINESS: {
    NAME: getEnvVar('NEXT_PUBLIC_BUSINESS_NAME', 'Nairobi Executive Stays'),
    EMAIL: getEnvVar('NEXT_PUBLIC_BUSINESS_EMAIL', 'hello@nairobiexecutivestays.com'),
    PHONE: getEnvVar('NEXT_PUBLIC_BUSINESS_PHONE', '+254700000000'),
    LOCATION: getEnvVar('NEXT_PUBLIC_BUSINESS_LOCATION', 'Kilimani, Nairobi'),
    LATITUDE: parseFloat(getEnvVar('NEXT_PUBLIC_BUSINESS_LATITUDE', '-1.2921')),
    LONGITUDE: parseFloat(getEnvVar('NEXT_PUBLIC_BUSINESS_LONGITUDE', '36.8219')),
  },

  // Images
  IMAGES: {
    NOMAD_SUITE: getEnvVar('NEXT_PUBLIC_NOMAD_SUITE_IMAGE', '/modern-minimalist-workspace-with-large-monitor-and.png'),
    MINIMALIST_SUITE: getEnvVar('NEXT_PUBLIC_MINIMALIST_SUITE_IMAGE', '/minimalist-bedroom-with-neutral-colors-and-natural.png'),
    WELLNESS_SUITE: getEnvVar('NEXT_PUBLIC_WELLNESS_SUITE_IMAGE', '/wellness-room-with-plants-yoga-mat-and-natural-lig.png'),
    PAUSE_SUITE: getEnvVar('NEXT_PUBLIC_PAUSE_SUITE_IMAGE', '/reset-ritual-wooden-tray-with-tea-and-snacks.png'),
  },
} as const

// Type exports for better TypeScript support
export type Environment = typeof env