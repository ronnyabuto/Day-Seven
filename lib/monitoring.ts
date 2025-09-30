import { onCLS, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals'
import React, { useEffect } from 'react'

/**
 * Performance monitoring and Core Web Vitals tracking
 * Following 2024 best practices for real user monitoring
 */

interface PerformanceMetric {
  name: string
  value: number
  id: string
  timestamp: number
  url: string
  userAgent: string
}

interface ErrorReport {
  message: string
  stack?: string
  url: string
  line?: number
  column?: number
  timestamp: number
  userAgent: string
  userId?: string
  sessionId: string
}

class PerformanceMonitor {
  private sessionId: string
  private userId?: string
  private metrics: PerformanceMetric[] = []
  private errors: ErrorReport[] = []
  private reportingEndpoint = '/api/analytics'

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeWebVitals()
    this.initializeErrorTracking()
    this.initializeNavigationTiming()
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeWebVitals() {
    const sendToAnalytics = (metric: Metric) => {
      const performanceMetric: PerformanceMetric = {
        name: metric.name,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        id: metric.id,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }

      this.recordMetric(performanceMetric)
      this.sendMetric(performanceMetric)
    }

    // Core Web Vitals
    onCLS(sendToAnalytics)
    onFCP(sendToAnalytics)
    onLCP(sendToAnalytics)
    onTTFB(sendToAnalytics)

    // INP tracking (primary interactivity metric since 2024)
    this.trackINP(sendToAnalytics)
  }

  private trackINP(callback: (metric: Metric) => void) {
    let maxINP = 0
    const inpId = `inp-${Date.now()}`

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'event') {
          const inp = (entry as any).processingStart - entry.startTime
          if (inp > maxINP) {
            maxINP = inp
            callback({
              name: 'INP',
              value: inp,
              id: inpId,
              delta: inp - maxINP,
            } as Metric)
          }
        }
      }
    })

    if ('observe' in observer) {
      observer.observe({ entryTypes: ['event'] })
    }
  }

  private initializeErrorTracking() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.reportError({
        message: event.message,
        stack: event.error?.stack,
        url: window.location.href,
        line: event.lineno,
        column: event.colno,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        userId: this.userId,
      })
    })

    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        userId: this.userId,
      })
    })
  }

  private initializeNavigationTiming() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        
        if (navigation) {
          const metrics = {
            'DNS-Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
            'TCP-Connection': navigation.connectEnd - navigation.connectStart,
            'TLS-Negotiation': navigation.secureConnectionStart > 0 ? navigation.connectEnd - navigation.secureConnectionStart : 0,
            'Request-Time': navigation.responseStart - navigation.requestStart,
            'Response-Time': navigation.responseEnd - navigation.responseStart,
            'DOM-Processing': navigation.domContentLoadedEventStart - navigation.responseEnd,
            'Resource-Loading': navigation.loadEventStart - navigation.domContentLoadedEventEnd,
          }

          Object.entries(metrics).forEach(([name, value]) => {
            if (value > 0) {
              const metric: PerformanceMetric = {
                name,
                value: Math.round(value),
                id: `nav-${name.toLowerCase()}-${Date.now()}`,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent,
              }
              this.recordMetric(metric)
            }
          })
        }
      }, 0)
    })
  }

  private recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric)
    
    // Keep only last 100 metrics in memory
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100)
    }
  }

  private sendMetric(metric: PerformanceMetric) {
    // Send to analytics endpoint
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        this.reportingEndpoint,
        JSON.stringify({ type: 'metric', data: metric })
      )
    } else {
      // Fallback for older browsers
      fetch(this.reportingEndpoint, {
        method: 'POST',
        body: JSON.stringify({ type: 'metric', data: metric }),
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(() => {
        // Ignore fetch errors for analytics
      })
    }
  }

  private reportError(error: ErrorReport) {
    this.errors.push(error)
    
    // Keep only last 50 errors in memory
    if (this.errors.length > 50) {
      this.errors = this.errors.slice(-50)
    }

    // Send error report
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        this.reportingEndpoint,
        JSON.stringify({ type: 'error', data: error })
      )
    } else {
      fetch(this.reportingEndpoint, {
        method: 'POST',
        body: JSON.stringify({ type: 'error', data: error }),
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(() => {
        // Ignore fetch errors for error reporting
      })
    }
  }

  // Public API methods
  public setUserId(userId: string) {
    this.userId = userId
  }

  public trackCustomEvent(name: string, properties: Record<string, unknown> = {}) {
    const event = {
      name,
      properties,
      timestamp: Date.now(),
      url: window.location.href,
      sessionId: this.sessionId,
      userId: this.userId,
    }

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        this.reportingEndpoint,
        JSON.stringify({ type: 'event', data: event })
      )
    }
  }

  public trackBookingEvent(eventName: string, suiteId: string, step?: string) {
    this.trackCustomEvent('booking-event', {
      eventName,
      suiteId,
      step,
      timestamp: Date.now(),
    })
  }

  public getMetrics() {
    return [...this.metrics]
  }

  public getErrors() {
    return [...this.errors]
  }

  public generateReport() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      url: window.location.href,
      timestamp: Date.now(),
      metrics: this.getMetrics(),
      errors: this.getErrors(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      connection: (navigator as any).connection ? {
        type: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink,
        rtt: (navigator as any).connection.rtt,
      } : null,
    }
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null

export function initializeMonitoring() {
  if (typeof window !== 'undefined' && !performanceMonitor) {
    performanceMonitor = new PerformanceMonitor()
  }
  return performanceMonitor
}

export function getPerformanceMonitor() {
  return performanceMonitor
}

// React hook for performance monitoring
export function usePerformanceMonitoring(userId?: string) {
  useEffect(() => {
    const monitor = initializeMonitoring()
    if (userId && monitor) {
      monitor.setUserId(userId)
    }
  }, [userId])

  return {
    trackEvent: (name: string, properties?: Record<string, unknown>) => {
      performanceMonitor?.trackCustomEvent(name, properties)
    },
    trackBooking: (eventName: string, suiteId: string, step?: string) => {
      performanceMonitor?.trackBookingEvent(eventName, suiteId, step)
    },
    generateReport: () => performanceMonitor?.generateReport(),
  }
}

// Component for automatic performance tracking
export function PerformanceTracker({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeMonitoring()
  }, [])

  return React.createElement(React.Fragment, null, children)
}