import type { Suite } from "@/data/types"

interface SuiteDetailsProps {
  suite: Suite
}

export function SuiteDetails({ suite }: SuiteDetailsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-12 mb-16">
      <SuiteImages suite={suite} />
      <SuiteInformation suite={suite} />
    </div>
  )
}

function SuiteImages({ suite }: { suite: Suite }) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-black/10">
        <img
          src={suite.image || "/placeholder.svg"}
          alt={suite.name}
          className="w-full h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>
      <SuiteDetailImages suite={suite} />
    </div>
  )
}

function SuiteDetailImages({ suite }: { suite: Suite }) {
  const detailImages = [
    {
      src: `/abstract-geometric-shapes.png?height=150&width=200&query=${suite.name} detail view 1`,
      alt: "Detail 1",
    },
    {
      src: `/abstract-geometric-shapes.png?height=150&width=200&query=${suite.name} detail view 2`, 
      alt: "Detail 2",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {detailImages.map(({ src, alt }, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-xl shadow-lg shadow-black/5"
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        </div>
      ))}
    </div>
  )
}

function SuiteInformation({ suite }: { suite: Suite }) {
  return (
    <div className="space-y-8">
      <SuiteHeader suite={suite} />
      <SuiteHighlights suite={suite} />
      {!suite.isHourly && <SuiteRates suite={suite} />}
    </div>
  )
}

function SuiteHeader({ suite }: { suite: Suite }) {
  return (
    <div>
      <h1 className="font-serif text-3xl text-foreground mb-2">
        {suite.name}
      </h1>
      <p className="text-muted-foreground text-lg">
        {suite.tagline}
      </p>
    </div>
  )
}

function SuiteHighlights({ suite }: { suite: Suite }) {
  return (
    <div>
      <h3 className="font-medium text-foreground mb-4">Highlights</h3>
      <ul className="space-y-2">
        {suite.highlights.map((highlight, index) => (
          <li key={index} className="flex items-center gap-3 text-muted-foreground">
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            {highlight}
          </li>
        ))}
      </ul>
    </div>
  )
}

function SuiteRates({ suite }: { suite: Suite }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">Weekly rate</span>
        <span className="font-medium">
          KSh {suite.weeklyRate.toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">Monthly rate</span>
        <span className="font-medium">
          KSh {suite.monthlyRate.toLocaleString()}
        </span>
      </div>
    </div>
  )
}