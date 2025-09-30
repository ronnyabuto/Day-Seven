interface HeroSectionProps {
  children: React.ReactNode
}

export function HeroSection({ children }: HeroSectionProps) {
  return (
    <section className="text-center mb-16 sm:mb-24 max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl shadow-black/10">
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-serif">
          Not a hotel, not an Airbnb clone. A quiet, modern space to work, rest, and stay longer. Each room is
          thoughtfully designed for the way you travel.
        </p>
      </div>
    </section>
  )
}