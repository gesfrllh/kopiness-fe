import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TextLabel from '@/components/Base/TextLabel'

describe('TextLabel', () => {
  it('renders title text', () => {
    render(<TextLabel title="Hello World" dot={false} size="md" />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('renders without dot by default', () => {
    const { container } = render(<TextLabel title="No Dot" dot={false} size="md" />)
    expect(container.querySelector('.rounded-full')).not.toBeInTheDocument()
  })

  it('renders dot when dot prop is true', () => {
    const { container } = render(<TextLabel title="With Dot" dot size="md" />)
    expect(container.querySelector('.rounded-full')).toBeInTheDocument()
  })

  it('applies default size (md) classes', () => {
    render(<TextLabel title="Medium" dot={false} size="md" />)
    const text = screen.getByText('Medium')
    expect(text.className).toContain('text-base')
  })

  it('applies xs size classes', () => {
    render(<TextLabel title="XSmall" dot={false} size="xs" />)
    const text = screen.getByText('XSmall')
    expect(text.className).toContain('text-xs')
  })

  it('applies lg size classes', () => {
    render(<TextLabel title="Large" dot={false} size="lg" />)
    const text = screen.getByText('Large')
    expect(text.className).toContain('text-lg')
  })
})
