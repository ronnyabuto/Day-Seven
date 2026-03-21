import type { Metadata } from "next"
import type { Suite } from "@/data/types"
import { env } from "@/lib/env"

export function generateSuiteMetadata(suite: Suite): Metadata {
  const title = `${suite.name} - ${env.BUSINESS.NAME}`
  const description = `${suite.tagline} Experience luxury accommodation in Nairobi with modern amenities, high-speed WiFi, and premium service. ${suite.isHourly ? 'Available for hourly bookings from KSh 1,000/hour.' : `Starting from KSh ${Math.floor(suite.weeklyRate / 7)}/night.`}`
  
  return {
    title,
    description,
    keywords: [
      suite.name,
      "Nairobi accommodation",
      "luxury apartments",
      "serviced apartments",
      suite.isHourly ? "hourly booking" : "nightly accommodation",
      "executive lodging",
      "Kilimani area",
    ],
    openGraph: {
      title,
      description,
      url: `${env.SEO.SITE_URL}/suite/${suite.id}`,
      siteName: env.BUSINESS.NAME,
      images: [
        {
          url: suite.image || env.IMAGES.NOMAD_SUITE,
          width: 1200,
          height: 630,
          alt: `${suite.name} interior at ${env.BUSINESS.NAME}`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [suite.image || env.IMAGES.NOMAD_SUITE],
      creator: env.SEO.TWITTER_HANDLE,
    },
    alternates: {
      canonical: `/suite/${suite.id}`,
    },
  }
}

export function generateSuiteStructuredData(suite: Suite) {
  return {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    "name": suite.name,
    "description": suite.tagline,
    "image": suite.image || env.IMAGES.NOMAD_SUITE,
    "url": `${env.SEO.SITE_URL}/suite/${suite.id}`,
    "identifier": suite.id,
    "offers": {
      "@type": "Offer",
      "priceRange": suite.isHourly 
        ? "KSh 1,000 - KSh 3,000 per hour"
        : `KSh ${Math.floor(suite.weeklyRate / 7)} - KSh ${suite.weeklyRate} per week`,
      "priceCurrency": "KES",
      "availability": suite.available ? "InStock" : "OutOfStock",
      "availabilityStarts": new Date().toISOString(),
    },
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "High-speed WiFi",
        "value": "100Mbps fiber internet"
      },
      {
        "@type": "LocationFeatureSpecification", 
        "name": "Workspace",
        "value": "Dedicated workspace with modern amenities"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Security",
        "value": "24/7 secure building access"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": env.BUSINESS.LOCATION,
      "addressLocality": "Nairobi",
      "addressCountry": "Kenya"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": env.BUSINESS.LATITUDE,
      "longitude": env.BUSINESS.LONGITUDE
    },
    "isPartOf": {
      "@type": "LodgingBusiness",
      "name": env.BUSINESS.NAME,
      "url": env.SEO.SITE_URL
    }
  }
}

export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${env.SEO.SITE_URL}${crumb.url}`
    }))
  }
}

export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": env.BUSINESS.NAME,
    "description": "Boutique serviced apartments in Nairobi for executive travelers, tech nomads, and wellness seekers.",
    "url": env.SEO.SITE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${env.SEO.SITE_URL}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": env.BUSINESS.NAME,
      "url": env.SEO.SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${env.SEO.SITE_URL}/logo.png`
      }
    }
  }
}