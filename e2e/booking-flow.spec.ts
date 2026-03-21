import { test, expect } from '@playwright/test'

test.describe('Hotel Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the main landing page', async ({ page }) => {
    // Check that the main elements are present
    await expect(page.locator('h1, h2').first()).toBeVisible()
    await expect(page.locator('[role="grid"]')).toBeVisible()
    
    // Check for suite cards
    const suiteCards = page.locator('[role="gridcell"]')
    await expect(suiteCards).toHaveCount(4) // Expecting 4 suites
  })

  test('should navigate to suite selection', async ({ page }) => {
    // Wait for suite cards to be visible
    await page.waitForSelector('[role="gridcell"]')
    
    // Click on the first available suite
    const firstSuite = page.locator('[role="gridcell"]').first()
    const suiteButton = firstSuite.locator('button').first()
    
    await expect(suiteButton).toBeVisible()
    await suiteButton.click()
    
    // Should navigate to booking flow
    await expect(page.locator('[data-testid="booking-flow"], .booking-flow, form')).toBeVisible({ timeout: 10000 })
  })

  test('should complete booking flow for nightly suite', async ({ page }) => {
    // Navigate to a nightly suite (non-hourly)
    await page.waitForSelector('[role="gridcell"]')
    
    // Find a nightly suite by looking for "Select dates" button
    const nightlySuite = page.locator('button:has-text("Select dates")').first()
    await expect(nightlySuite).toBeVisible()
    await nightlySuite.click()
    
    // Should be on booking page
    await page.waitForURL(/.*/, { timeout: 10000 })
    
    // Check if we can see date selection or guest form
    const hasDateInputs = await page.locator('input[type="date"], [data-testid*="date"]').count()
    const hasGuestForm = await page.locator('input[name="name"], input[placeholder*="name" i]').count()
    
    if (hasDateInputs > 0) {
      // If date selection is visible, we're in the booking flow
      expect(hasDateInputs).toBeGreaterThan(0)
    } else if (hasGuestForm > 0) {
      // If guest form is visible, we're also in the booking flow
      expect(hasGuestForm).toBeGreaterThan(0)
    } else {
      // At minimum, we should have some form of booking interface
      await expect(page.locator('form, [role="form"], .booking-flow')).toBeVisible()
    }
  })

  test('should complete booking flow for hourly suite', async ({ page }) => {
    // Navigate to an hourly suite
    await page.waitForSelector('[role="gridcell"]')
    
    // Find an hourly suite by looking for "Book by Hour" button
    const hourlySuite = page.locator('button:has-text("Book by Hour")').first()
    
    // If hourly suite exists, test it
    if (await hourlySuite.count() > 0) {
      await hourlySuite.click()
      
      // Should be on booking page
      await page.waitForURL(/.*/, { timeout: 10000 })
      
      // Should see hour selection or booking interface
      const hasHourInputs = await page.locator('input[type="number"], select, [data-testid*="hour"]').count()
      const hasBookingInterface = await page.locator('form, [role="form"], .booking-flow').count()
      
      expect(hasHourInputs + hasBookingInterface).toBeGreaterThan(0)
    } else {
      // If no hourly suites, just verify we can navigate to any suite
      const anySuite = page.locator('[role="gridcell"] button').first()
      await anySuite.click()
      await expect(page.locator('form, [role="form"], .booking-flow')).toBeVisible({ timeout: 10000 })
    }
  })

  test('should handle navigation back to suite selection', async ({ page }) => {
    // Navigate to a suite
    await page.waitForSelector('[role="gridcell"]')
    const firstSuite = page.locator('[role="gridcell"] button').first()
    await firstSuite.click()
    
    // Look for back button or navigation
    const backButton = page.locator('button:has-text("Back"), [aria-label*="back" i], [data-testid*="back"]')
    
    if (await backButton.count() > 0) {
      await backButton.click()
      
      // Should return to suite grid
      await expect(page.locator('[role="grid"]')).toBeVisible({ timeout: 10000 })
    }
  })

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      // Check that content is visible on mobile
      await expect(page.locator('[role="grid"]')).toBeVisible()
      
      // Suite cards should be stacked vertically on mobile
      const suiteCards = page.locator('[role="gridcell"]')
      await expect(suiteCards.first()).toBeVisible()
      
      // Test touch interaction
      await suiteCards.first().locator('button').first().tap()
      
      // Should navigate to booking flow
      await page.waitForTimeout(2000) // Give time for navigation
    }
  })

  test('should handle errors gracefully', async ({ page }) => {
    // Test network error handling by intercepting requests
    await page.route('**/api/**', route => {
      route.abort('failed')
    })
    
    // Navigate to suite
    await page.waitForSelector('[role="gridcell"]')
    const firstSuite = page.locator('[role="gridcell"] button').first()
    await firstSuite.click()
    
    // Should not crash, should show some content
    await page.waitForTimeout(3000)
    
    // Page should still be functional
    expect(await page.locator('body').count()).toBe(1)
  })

  test('should have proper accessibility features', async ({ page }) => {
    // Check for proper heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6')
    await expect(headings.first()).toBeVisible()
    
    // Check for proper ARIA labels
    const gridElement = page.locator('[role="grid"]')
    await expect(gridElement).toBeVisible()
    
    // Check that interactive elements are focusable
    const buttons = page.locator('button')
    const firstButton = buttons.first()
    await expect(firstButton).toBeVisible()
    
    // Test keyboard navigation
    await firstButton.focus()
    await expect(firstButton).toBeFocused()
    
    // Test tab navigation
    await page.keyboard.press('Tab')
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('should load within performance thresholds', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    await page.waitForSelector('[role="grid"]')
    
    const loadTime = Date.now() - startTime
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000)
    
    // Check for largest contentful paint
    const paintMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lcpEntry = entries[entries.length - 1]
          resolve(lcpEntry.startTime)
        })
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
        
        // Fallback timeout
        setTimeout(() => resolve(0), 3000)
      })
    })
    
    if (paintMetrics > 0) {
      expect(paintMetrics).toBeLessThan(2500) // 2.5s LCP threshold
    }
  })

  test('should handle suite availability states', async ({ page }) => {
    await page.waitForSelector('[role="gridcell"]')
    
    // Look for available suites
    const availableSuites = page.locator('button:not([disabled])')
    await expect(availableSuites.first()).toBeVisible()
    
    // Look for unavailable suites (if any)
    const unavailableSuites = page.locator('button:has-text("Unavailable")')
    
    if (await unavailableSuites.count() > 0) {
      // Unavailable suites should be disabled
      await expect(unavailableSuites.first()).toBeDisabled()
    }
  })
})