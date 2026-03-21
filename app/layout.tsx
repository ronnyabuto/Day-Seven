import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { env } from "@/lib/env"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: `${env.BUSINESS.NAME} - Boutique Serviced Apartments`,
  description:
    "A quiet, modern space to work, rest, and stay longer. Executive serviced apartments in Nairobi for tech nomads, minimalists, and wellness travelers.",
  keywords: [
    "Nairobi serviced apartments",
    "executive accommodation Nairobi",
    "boutique apartments Kenya",
    "tech nomad accommodation",
    "minimalist stays Nairobi",
    "wellness accommodation",
    "Kilimani apartments",
    "long stay Nairobi",
    "business travel Kenya",
  ],
  authors: [{ name: env.BUSINESS.NAME }],
  creator: env.BUSINESS.NAME,
  publisher: env.BUSINESS.NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(env.SEO.SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${env.BUSINESS.NAME} - Boutique Serviced Apartments`,
    description:
      "A quiet, modern space to work, rest, and stay longer. Executive serviced apartments in Nairobi for tech nomads, minimalists, and wellness travelers.",
    url: env.SEO.SITE_URL,
    siteName: env.BUSINESS.NAME,
    images: [
      {
        url: env.IMAGES.NOMAD_SUITE,
        width: 1200,
        height: 630,
        alt: `Modern minimalist workspace at ${env.BUSINESS.NAME}`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${env.BUSINESS.NAME} - Boutique Serviced Apartments`,
    description: "A quiet, modern space to work, rest, and stay longer. Executive serviced apartments in Nairobi.",
    images: [env.IMAGES.NOMAD_SUITE],
    creator: env.SEO.TWITTER_HANDLE,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: env.SEO.GOOGLE_VERIFICATION || undefined,
  },
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LodgingBusiness",
              name: env.BUSINESS.NAME,
              description:
                "Boutique serviced apartments in Nairobi for executive travelers, tech nomads, and wellness seekers.",
              url: env.SEO.SITE_URL,
              telephone: env.BUSINESS.PHONE,
              email: env.BUSINESS.EMAIL,
              address: {
                "@type": "PostalAddress",
                streetAddress: env.BUSINESS.LOCATION,
                addressLocality: "Nairobi",
                addressCountry: "Kenya",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: env.BUSINESS.LATITUDE,
                longitude: env.BUSINESS.LONGITUDE,
              },
              amenityFeature: [
                {
                  "@type": "LocationFeatureSpecification",
                  name: "High-speed WiFi",
                  value: "100Mbps fiber internet",
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "24/7 Security",
                  value: "Secure building with round-the-clock security",
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "Workspace",
                  value: "Dedicated workspace with 4K monitor",
                },
              ],
              priceRange: "KSh 25,000 - KSh 30,000 per week",
              starRating: {
                "@type": "Rating",
                ratingValue: "5",
              },
              image: [
                `${env.SEO.SITE_URL}${env.IMAGES.NOMAD_SUITE}`,
                `${env.SEO.SITE_URL}${env.IMAGES.MINIMALIST_SUITE}`,
                `${env.SEO.SITE_URL}${env.IMAGES.WELLNESS_SUITE}`,
              ],
              sameAs: [
                env.SOCIAL.INSTAGRAM,
                env.SOCIAL.TWITTER,
                env.SOCIAL.LINKEDIN,
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
