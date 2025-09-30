import {
  calculateHourlyRate,
  calculateStayDuration,
  calculateStay,
  formatCurrency,
  calculateDailyRate,
} from './pricing'
import type { Suite, DateRange } from '@/data/types'

describe('Pricing Utilities', () => {
  describe('calculateHourlyRate', () => {
    test('should return correct rate for 1 hour', () => {
      expect(calculateHourlyRate(1)).toBe(1000)
    })

    test('should return correct rate for 2 hours', () => {
      expect(calculateHourlyRate(2)).toBe(1800)
    })

    test('should return correct rate for 3 hours', () => {
      expect(calculateHourlyRate(3)).toBe(4800)
    })

    test('should calculate rate for 4+ hours at default rate', () => {
      expect(calculateHourlyRate(4)).toBe(6000) // 4 * 1500
      expect(calculateHourlyRate(8)).toBe(12000) // 8 * 1500
    })

    test('should handle edge cases', () => {
      expect(calculateHourlyRate(0)).toBe(0)
      expect(calculateHourlyRate(-1)).toBe(-1500)
    })
  })

  describe('calculateStayDuration', () => {
    test('should calculate duration for same day', () => {
      const from = new Date('2024-01-01')
      const to = new Date('2024-01-01')
      const dateRange: DateRange = { from, to }
      
      expect(calculateStayDuration(dateRange)).toBe(0)
    })

    test('should calculate duration for multiple days', () => {
      const from = new Date('2024-01-01')
      const to = new Date('2024-01-03')
      const dateRange: DateRange = { from, to }
      
      expect(calculateStayDuration(dateRange)).toBe(2)
    })

    test('should handle partial days by ceiling', () => {
      const from = new Date('2024-01-01 14:00:00')
      const to = new Date('2024-01-02 10:00:00')
      const dateRange: DateRange = { from, to }
      
      expect(calculateStayDuration(dateRange)).toBe(1)
    })

    test('should return 0 for invalid dates', () => {
      expect(calculateStayDuration({ from: null, to: null })).toBe(0)
      expect(calculateStayDuration({ from: new Date(), to: null })).toBe(0)
      expect(calculateStayDuration({ from: null, to: new Date() })).toBe(0)
    })
  })

  describe('calculateStay', () => {
    const mockSuite: Suite = {
      id: 'test-suite',
      name: 'Test Suite',
      tagline: 'Test',
      isHourly: false,
      available: true,
      weeklyRate: 25000,
      monthlyRate: 90000,
      lastBooked: '1 day ago',
      image: '/test.jpg',
      icon: jest.fn(),
    }

    const mockHourlySuite: Suite = {
      ...mockSuite,
      isHourly: true,
    }

    describe('hourly bookings', () => {
      test('should calculate hourly stay correctly', () => {
        const result = calculateStay(mockHourlySuite, { from: null, to: null }, 2)
        
        expect(result).toEqual({
          days: 0,
          hours: 2,
          rate: 1800,
          discount: 0,
        })
      })

      test('should default to 1 hour if not specified', () => {
        const result = calculateStay(mockHourlySuite, { from: null, to: null })
        
        expect(result).toEqual({
          days: 0,
          hours: 1,
          rate: 1000,
          discount: 0,
        })
      })
    })

    describe('nightly bookings', () => {
      test('should calculate nightly rate for short stays', () => {
        const from = new Date('2024-01-01')
        const to = new Date('2024-01-03')
        const dateRange: DateRange = { from, to }
        
        const result = calculateStay(mockSuite, dateRange)
        
        expect(result).toEqual({
          days: 2,
          rate: (25000 / 7) * 2, // Daily rate * days
          discount: 0,
        })
      })

      test('should apply weekly discount for 7+ days', () => {
        const from = new Date('2024-01-01')
        const to = new Date('2024-01-10')
        const dateRange: DateRange = { from, to }
        
        const result = calculateStay(mockSuite, dateRange)
        
        expect(result.days).toBe(9)
        expect(result.discount).toBe(0.1) // 10% weekly discount
        expect(result.rate).toBe(((25000 / 7) * 9) * 0.9) // With discount applied
      })

      test('should apply monthly discount for 30+ days', () => {
        const from = new Date('2024-01-01')
        const to = new Date('2024-02-15')
        const dateRange: DateRange = { from, to }
        
        const result = calculateStay(mockSuite, dateRange)
        
        expect(result.days).toBe(45)
        expect(result.discount).toBe(0.15) // 15% monthly discount
        expect(result.rate).toBe(90000 * 0.85) // Monthly rate with discount
      })

      test('should return zero for invalid dates', () => {
        const result = calculateStay(mockSuite, { from: null, to: null })
        
        expect(result).toEqual({
          days: 0,
          rate: 0,
          discount: 0,
        })
      })
    })
  })

  describe('formatCurrency', () => {
    test('should format small amounts correctly', () => {
      expect(formatCurrency(1000)).toBe('KSh 1,000')
      expect(formatCurrency(500)).toBe('KSh 500')
    })

    test('should format large amounts with commas', () => {
      expect(formatCurrency(25000)).toBe('KSh 25,000')
      expect(formatCurrency(1000000)).toBe('KSh 1,000,000')
    })

    test('should handle zero and negative amounts', () => {
      expect(formatCurrency(0)).toBe('KSh 0')
      expect(formatCurrency(-500)).toBe('KSh -500')
    })

    test('should handle decimal amounts', () => {
      expect(formatCurrency(1000.50)).toBe('KSh 1,000.5')
    })
  })

  describe('calculateDailyRate', () => {
    test('should calculate daily rate from weekly rate', () => {
      const suite: Suite = {
        id: 'test',
        name: 'Test',
        tagline: 'Test',
        isHourly: false,
        available: true,
        weeklyRate: 21000,
        monthlyRate: 90000,
        lastBooked: '1 day ago',
        image: '/test.jpg',
        icon: jest.fn(),
      }
      
      expect(calculateDailyRate(suite)).toBe(3000)
    })

    test('should handle edge cases', () => {
      const suite: Suite = {
        id: 'test',
        name: 'Test',
        tagline: 'Test',
        isHourly: false,
        available: true,
        weeklyRate: 0,
        monthlyRate: 0,
        lastBooked: '1 day ago',
        image: '/test.jpg',
        icon: jest.fn(),
      }
      
      expect(calculateDailyRate(suite)).toBe(0)
    })
  })

  describe('property-based testing', () => {
    test('pricing calculations should always be positive for valid inputs', () => {
      // Generate random test data
      for (let i = 0; i < 50; i++) {
        const hours = Math.floor(Math.random() * 10) + 1
        const weeklyRate = Math.floor(Math.random() * 50000) + 1000
        
        const hourlyRate = calculateHourlyRate(hours)
        const dailyRate = calculateDailyRate({
          id: 'test',
          name: 'Test',
          tagline: 'Test',
          isHourly: false,
          available: true,
          weeklyRate,
          monthlyRate: weeklyRate * 4,
          lastBooked: '1 day ago',
          image: '/test.jpg',
          icon: jest.fn(),
        })
        
        expect(hourlyRate).toBeGreaterThan(0)
        expect(dailyRate).toBeGreaterThan(0)
      }
    })

    test('longer stays should never cost less than shorter stays', () => {
      const suite: Suite = {
        id: 'test',
        name: 'Test',
        tagline: 'Test',
        isHourly: false,
        available: true,
        weeklyRate: 25000,
        monthlyRate: 90000,
        lastBooked: '1 day ago',
        image: '/test.jpg',
        icon: jest.fn(),
      }

      for (let days = 1; days <= 10; days++) {
        const from = new Date('2024-01-01')
        const to = new Date(from)
        to.setDate(to.getDate() + days)

        const currentStay = calculateStay(suite, { from, to })
        
        if (days > 1) {
          const previousFrom = new Date('2024-01-01')
          const previousTo = new Date(previousFrom)
          previousTo.setDate(previousTo.getDate() + days - 1)
          
          const previousStay = calculateStay(suite, { from: previousFrom, to: previousTo })
          
          // Current stay should cost at least as much as previous stay
          expect(currentStay.rate).toBeGreaterThanOrEqual(previousStay.rate)
        }
      }
    })
  })
})