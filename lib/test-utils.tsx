import { axe, toHaveNoViolations } from 'jest-axe'
import { SUITE_IDS } from '@/data/types'
import { Calendar } from "lucide-react"

expect.extend(toHaveNoViolations)

export const createMockSuite = (overrides = {}) => ({
    id: 'nomad-suite',
    name: 'Nomad Suite',
    tagline: 'Perfect for digital nomads and remote workers',
    image: '/images/nomad-suite.jpg',
    highlights: [],
    weeklyRate: 25000,
    monthlyRate: 80000,
    icon: Calendar,
    available: true,
    colorTemp: 'neutral' as const,
    lastBooked: '2 days ago',
    ...overrides,
})

export const expectToBeAccessible = async (container: HTMLElement) => {
    const results = await axe(container)
    expect(results).toHaveNoViolations()
}
