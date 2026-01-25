import React from "react"
import { SuiteCard } from "./SuiteCard"
import { useSuiteSelection } from "@/hooks/useSuiteSelection"
import { useScrollEffects } from "@/hooks/useScroll"
import { FadeInUp, ScaleOnHover } from "@/components/ui/AnimationWrapper"

interface SuiteGridProps {
  onSuiteSelect: (suiteId: string) => void
}

export const SuiteGrid = React.memo(function SuiteGrid({ onSuiteSelect }: SuiteGridProps) {
  const { availableSuites, getSuiteColorClasses } = useSuiteSelection()
  const { getParallaxOffset } = useScrollEffects()

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16 sm:mb-24" role="grid" aria-label="Available suites">
      {availableSuites.map((suite, index) => (
        <div
          key={suite.id}
          className={getSuiteColorClasses(suite)}
          style={{
            transform: `translateY(${getParallaxOffset(0.02, index + 1)}px)`,
          }}
          role="gridcell"
        >
          <FadeInUp delay={index * 0.1} duration={0.6}>
            <ScaleOnHover>
              <SuiteCard
                suite={suite}
                onSelect={onSuiteSelect}
              />
            </ScaleOnHover>
          </FadeInUp>
        </div>
      ))}
    </div>
  )
})