import { Shield, Wifi, MapPin } from "lucide-react"
import { GoogleMap } from "@/components/google-map"
import { env } from "@/lib/env"

export function LocationSection() {
  return (
    <section className="mb-16 sm:mb-24">
      <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
        <LocationInfo />
        <LocationMap />
      </div>
    </section>
  )
}

function LocationInfo() {
  const features = [
    {
      icon: Shield,
      text: "24/7 security",
    },
    {
      icon: Wifi,
      text: "Fiber internet",
    },
    {
      icon: MapPin,
      text: "Central location",
    },
  ]

  return (
    <div>
      <h2 className="font-serif text-xl sm:text-2xl text-foreground mb-4">
        {env.BUSINESS.LOCATION}
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base">
        Located in a secure, well-connected neighborhood with reliable power, fast internet, and easy access to
        the city center.
      </p>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
        {features.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2">
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function LocationMap() {
  return (
    <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden shadow-2xl shadow-black/10 border border-white/20">
      <GoogleMap className="w-full h-full" />
    </div>
  )
}