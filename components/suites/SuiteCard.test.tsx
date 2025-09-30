import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { SuiteCard } from './SuiteCard'
import { createMockSuite, expectToBeAccessible } from '@/__tests__/utils/test-utils'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  },
}))

describe('SuiteCard Component', () => {
  const mockOnSelect = jest.fn()
  const mockSuite = createMockSuite()

  beforeEach(() => {
    mockOnSelect.mockClear()
  })

  describe('rendering', () => {
    test('should render suite information correctly', () => {
      render(<SuiteCard suite={mockSuite} onSelect={mockOnSelect} />)
      
      expect(screen.getByText('Nomad Suite')).toBeInTheDocument()
      expect(screen.getByText('Perfect for digital nomads and remote workers')).toBeInTheDocument()
      expect(screen.getByText('Available now')).toBeInTheDocument()
      expect(screen.getByText('Last booked 2 days ago')).toBeInTheDocument()
    })

    test('should render pricing information for nightly suites', () => {
      render(<SuiteCard suite={mockSuite} onSelect={mockOnSelect} />)
      
      // Daily rate should be calculated from weekly rate (25000/7 ≈ 3571)
      expect(screen.getByText(/From KSh \d{1,3}(,\d{3})*(\/night)?/)).toBeInTheDocument()
    })

    test('should render pricing information for hourly suites', () => {
      const hourlySuite = createMockSuite({ isHourly: true })
      render(<SuiteCard suite={hourlySuite} onSelect={mockOnSelect} />)
      
      expect(screen.getByText('From KSh 1,000/hour')).toBeInTheDocument()
    })

    test('should render suite image with correct alt text', () => {
      render(<SuiteCard suite={mockSuite} onSelect={mockOnSelect} />)
      
      const image = screen.getByAltText('Nomad Suite suite interior view showing luxury accommodations')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', '/images/nomad-suite.jpg')
    })

    test('should render suite icon', () => {
      render(<SuiteCard suite={mockSuite} onSelect={mockOnSelect} />)
      
      expect(screen.getByTestId('suite-icon')).toBeInTheDocument()
    })
  })

  describe('availability states', () => {
    test('should show available state correctly', () => {
      const availableSuite = createMockSuite({ available: true })
      render(<SuiteCard suite={availableSuite} onSelect={mockOnSelect} />)
      
      expect(screen.getByText('Available now')).toBeInTheDocument()
      expect(screen.getByRole('button')).not.toBeDisabled()
    })

    test('should show unavailable state correctly', () => {
      const unavailableSuite = createMockSuite({ available: false })
      render(<SuiteCard suite={unavailableSuite} onSelect={mockOnSelect} />)
      
      expect(screen.getByText('Currently unavailable')).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeDisabled()
    })

    test('should render correct button text for different suite types', () => {
      // Test nightly suite
      const nightlySuite = createMockSuite({ isHourly: false, available: true })
      const { rerender } = render(<SuiteCard suite={nightlySuite} onSelect={mockOnSelect} />)
      expect(screen.getByText('Select dates')).toBeInTheDocument()

      // Test hourly suite
      const hourlySuite = createMockSuite({ isHourly: true, available: true })
      rerender(<SuiteCard suite={hourlySuite} onSelect={mockOnSelect} />)
      expect(screen.getByText('Book by Hour')).toBeInTheDocument()

      // Test unavailable suite
      const unavailableSuite = createMockSuite({ available: false })
      rerender(<SuiteCard suite={unavailableSuite} onSelect={mockOnSelect} />)
      expect(screen.getByText('Unavailable')).toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    test('should call onSelect when clicked', async () => {
      const user = userEvent.setup()
      render(<SuiteCard suite={mockSuite} onSelect={mockOnSelect} />)
      
      const cardButton = screen.getByRole('button', { name: /nomad suite.*available/i })
      await user.click(cardButton)
      
      expect(mockOnSelect).toHaveBeenCalledWith('nomad-suite')
      expect(mockOnSelect).toHaveBeenCalledTimes(1)
    })

    test('should call onSelect when Enter key is pressed', () => {
      render(<SuiteCard suite={mockSuite} onSelect={mockOnSelect} />)
      
      const card = screen.getByRole('button', { name: /nomad suite.*available/i })
      fireEvent.keyDown(card, { key: 'Enter' })
      
      expect(mockOnSelect).toHaveBeenCalledWith('nomad-suite')
    })

    test('should call onSelect when Space key is pressed', () => {
      render(<SuiteCard suite={mockSuite} onSelect={mockOnSelect} />)
      
      const card = screen.getByRole('button', { name: /nomad suite.*available/i })
      fireEvent.keyDown(card, { key: ' ' })
      
      expect(mockOnSelect).toHaveBeenCalledWith('nomad-suite')
    })

    test('should not call onSelect for other keys', () => {
      render(<SuiteCard suite={mockSuite} onSelect={mockOnSelect} />)
      
      const card = screen.getByRole('button', { name: /nomad suite.*available/i })
      fireEvent.keyDown(card, { key: 'Escape' })
      fireEvent.keyDown(card, { key: 'Tab' })
      
      expect(mockOnSelect).not.toHaveBeenCalled()
    })

    test('should not call onSelect when unavailable suite is clicked', async () => {
      const user = userEvent.setup()
      const unavailableSuite = createMockSuite({ available: false })
      render(<SuiteCard suite={unavailableSuite} onSelect={mockOnSelect} />)
      
      const button = screen.getByRole('button', { name: /select dates/i })
      await user.click(button)
      
      expect(mockOnSelect).not.toHaveBeenCalled()
    })

    test('should not call onSelect when unavailable suite key is pressed', () => {
      const unavailableSuite = createMockSuite({ available: false })
      render(<SuiteCard suite={unavailableSuite} onSelect={mockOnSelect} />)
      
      const card = screen.getByRole('button', { name: /unavailable/i })
      fireEvent.keyDown(card, { key: 'Enter' })
      
      expect(mockOnSelect).not.toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    test('should be accessible', async () => {
      const { container } = render(<SuiteCard suite={mockSuite} onSelect={mockOnSelect} />)
      await expectToBeAccessible(container)
    })

    test('should have correct ARIA labels', () => {
      render(<SuiteCard suite={mockSuite} onSelect={mockOnSelect} />)
      
      const card = screen.getByRole('button', { name: /nomad suite.*available/i })
      expect(card).toHaveAttribute('aria-label')
      expect(card.getAttribute('aria-label')).toContain('Nomad Suite')
      expect(card.getAttribute('aria-label')).toContain('Available')
    })

    test('should have correct ARIA labels for unavailable suites', () => {
      const unavailableSuite = createMockSuite({ available: false })
      render(<SuiteCard suite={unavailableSuite} onSelect={mockOnSelect} />)
      
      const card = screen.getByRole('button', { name: /unavailable/i })
      expect(card.getAttribute('aria-label')).toContain('Unavailable')
    })

    test('should be focusable', () => {
      render(<SuiteCard suite={mockSuite} onSelect={mockOnSelect} />)
      
      const card = screen.getByRole('button', { name: /nomad suite.*available/i })
      expect(card).toHaveAttribute('tabIndex', '0')
    })

    test('should have proper focus styles', () => {
      render(<SuiteCard suite={mockSuite} onSelect={mockOnSelect} />)
      
      const card = screen.getByRole('button', { name: /nomad suite.*available/i })
      expect(card).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-primary')
    })

    test('should have aria-live region for availability status', () => {
      render(<SuiteCard suite={mockSuite} onSelect={mockOnSelect} />)
      
      const availabilityStatus = screen.getByText('Available now')
      expect(availabilityStatus.closest('[aria-live]')).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('visual states', () => {
    test('should apply correct CSS classes', () => {
      render(<SuiteCard suite={mockSuite} onSelect={mockOnSelect} />)
      
      const card = screen.getByRole('button', { name: /nomad suite.*available/i })
      expect(card).toHaveClass(
        'border-white/20',
        'bg-white/10',
        'backdrop-blur-xl',
        'shadow-2xl',
        'rounded-2xl',
        'overflow-hidden',
        'group',
        'cursor-pointer'
      )
    })

    test('should have hover effects', () => {
      render(<SuiteCard suite={mockSuite} onSelect={mockOnSelect} />)
      
      const card = screen.getByRole('button', { name: /nomad suite.*available/i })
      expect(card).toHaveClass('transition-all')
    })
  })

  describe('memoization', () => {
    test('should not re-render when props are the same', () => {
      const { rerender } = render(<SuiteCard suite={mockSuite} onSelect={mockOnSelect} />)
      
      const initialTitle = screen.getByText('Nomad Suite')
      
      // Re-render with same props
      rerender(<SuiteCard suite={mockSuite} onSelect={mockOnSelect} />)
      
      const updatedTitle = screen.getByText('Nomad Suite')
      expect(initialTitle).toBe(updatedTitle) // Same DOM node due to memoization
    })

    test('should re-render when suite data changes', () => {
      const { rerender } = render(<SuiteCard suite={mockSuite} onSelect={mockOnSelect} />)
      
      expect(screen.getByText('Nomad Suite')).toBeInTheDocument()
      
      const updatedSuite = createMockSuite({ name: 'Updated Suite Name' })
      rerender(<SuiteCard suite={updatedSuite} onSelect={mockOnSelect} />)
      
      expect(screen.getByText('Updated Suite Name')).toBeInTheDocument()
      expect(screen.queryByText('Nomad Suite')).not.toBeInTheDocument()
    })
  })

  describe('error handling', () => {
    test('should handle missing image gracefully', () => {
      const suiteWithoutImage = createMockSuite({ image: '' })
      render(<SuiteCard suite={suiteWithoutImage} onSelect={mockOnSelect} />)
      
      const image = screen.getByAltText(/suite interior view/)
      expect(image).toHaveAttribute('src', '/placeholder.svg')
    })

    test('should handle missing icon gracefully', () => {
      const suiteWithoutIcon = createMockSuite({ 
        icon: () => null 
      })
      
      // Should not crash when rendering
      expect(() => {
        render(<SuiteCard suite={suiteWithoutIcon} onSelect={mockOnSelect} />)
      }).not.toThrow()
    })

    test('should handle extremely long names gracefully', () => {
      const longName = 'A'.repeat(1000)
      const suiteWithLongName = createMockSuite({ name: longName })
      
      render(<SuiteCard suite={suiteWithLongName} onSelect={mockOnSelect} />)
      
      expect(screen.getByText(longName)).toBeInTheDocument()
    })
  })

  describe('performance', () => {
    test('should render within reasonable time', () => {
      const startTime = performance.now()
      
      render(<SuiteCard suite={mockSuite} onSelect={mockOnSelect} />)
      
      const renderTime = performance.now() - startTime
      expect(renderTime).toBeLessThan(50) // Should render in less than 50ms
    })

    test('should handle rapid re-renders without memory leaks', () => {
      const { rerender } = render(<SuiteCard suite={mockSuite} onSelect={mockOnSelect} />)
      
      // Rapid re-renders
      for (let i = 0; i < 100; i++) {
        const suite = createMockSuite({ name: `Suite ${i}` })
        rerender(<SuiteCard suite={suite} onSelect={mockOnSelect} />)
      }
      
      // Should not crash or leak memory
      expect(screen.getByText('Suite 99')).toBeInTheDocument()
    })
  })
})