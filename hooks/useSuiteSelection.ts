import { useState, useCallback, useMemo } from "react"
import type { Suite, ColorTemperature } from "@/data/types"
import { suites, getSuiteById } from "@/data/suites"
import { isEvening } from "@/utils/time"

/**
 * Custom hook for suite selection and styling logic
 * Manages suite-specific behavior and appearance
 */

export function useSuiteSelection() {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time periodically for evening detection
  const updateTime = useCallback(() => {
    setCurrentTime(new Date())
  }, [])

  // Get suite color classes based on time and suite properties
  const getSuiteColorClasses = useCallback((suite: Suite): string => {
    const baseClasses =
      "group cursor-pointer border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-xl"
    const evening = isEvening(currentTime)

    if (suite.colorTemp === "muted") {
      return `${baseClasses} hover:shadow-muted-foreground/10 hover:bg-muted/5 opacity-90`
    } else if (suite.colorTemp === "cool" && !evening) {
      return `${baseClasses} hover:shadow-blue-500/10 hover:bg-blue-50/5`
    } else if (suite.colorTemp === "warm" || evening) {
      return `${baseClasses} hover:shadow-amber-500/10 hover:bg-amber-50/5`
    }
    return `${baseClasses} hover:shadow-primary/10`
  }, [currentTime])

  // Memoized suite data
  const availableSuites = useMemo(() => {
    return suites.filter(suite => suite.available)
  }, [])

  const hourlySuites = useMemo(() => {
    return suites.filter(suite => suite.isHourly)
  }, [])

  const nightlySuites = useMemo(() => {
    return suites.filter(suite => !suite.isHourly)
  }, [])

  // Get suite by ID
  const getSuite = useCallback((id: string): Suite | undefined => {
    return getSuiteById(id)
  }, [])

  return {
    // Data
    allSuites: suites,
    availableSuites,
    hourlySuites,
    nightlySuites,
    
    // State
    currentTime,
    
    // Functions
    getSuite,
    getSuiteColorClasses,
    updateTime,
    isEvening: isEvening(currentTime),
  }
}