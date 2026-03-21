import { Mail, Phone, Instagram, Twitter, Linkedin } from "lucide-react"
import { env } from "@/lib/env"

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-white/5 backdrop-blur-xl shadow-lg shadow-black/5">
      <div className="max-w-6xl mx-auto px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
          <ContactSection />
          <PoliciesSection />
          <ComingSoonSection />
        </div>
      </div>
    </footer>
  )
}

function ContactSection() {
  return (
    <div className="space-y-4">
      <h3 className="font-serif text-base sm:text-lg text-foreground mb-4">Contact</h3>
      <div className="space-y-3 text-xs sm:text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <p className="break-all">{env.CONTACT_EMAIL}</p>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <p>{env.CONTACT_PHONE}</p>
        </div>
        <SocialLinks />
      </div>
    </div>
  )
}

function SocialLinks() {
  const socialLinks = [
    {
      href: env.SOCIAL.INSTAGRAM,
      icon: Instagram,
      label: "Instagram",
    },
    {
      href: env.SOCIAL.TWITTER,
      icon: Twitter,
      label: "Twitter",
    },
    {
      href: env.SOCIAL.LINKEDIN,
      icon: Linkedin,
      label: "LinkedIn",
    },
    {
      href: env.SOCIAL.TIKTOK,
      icon: TikTokIcon,
      label: "TikTok",
    },
  ]

  return (
    <div className="flex gap-2 sm:gap-3 pt-2">
      {socialLinks.map(({ href, icon: Icon, label }) => (
        <a
          key={label}
          href={href}
          className="w-7 h-7 sm:w-8 sm:h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg shadow-black/5 hover:scale-110"
          aria-label={label}
        >
          <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
        </a>
      ))}
    </div>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

function PoliciesSection() {
  const policies = [
    "Cancellation policy",
    "House rules",
    "Privacy policy",
  ]

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-base sm:text-lg text-foreground mb-4">Policies</h3>
      <div className="space-y-3 text-xs sm:text-sm text-muted-foreground">
        {policies.map((policy) => (
          <p
            key={policy}
            className="hover:text-foreground transition-colors cursor-pointer"
          >
            {policy}
          </p>
        ))}
      </div>
    </div>
  )
}

function ComingSoonSection() {
  const comingFeatures = [
    "Executive transport",
    "Private chef service",
    "Curated experiences",
  ]

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-base sm:text-lg text-foreground mb-4">Coming Soon</h3>
      <div className="space-y-3 text-xs sm:text-sm text-muted-foreground">
        {comingFeatures.map((feature) => (
          <p key={feature}>{feature}</p>
        ))}
      </div>
    </div>
  )
}