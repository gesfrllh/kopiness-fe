import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CTA from '@/components/Base/cta'

describe('CTA', () => {
  it('renders title', () => {
    render(<CTA title="Welcome" />)
    expect(screen.getByText('Welcome')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<CTA title="Title" subtitle="Subtitle text" />)
    expect(screen.getByText('Subtitle text')).toBeInTheDocument()
  })

  it('does not render subtitle when not provided', () => {
    render(<CTA title="Title" />)
    expect(screen.queryByText('Subtitle text')).not.toBeInTheDocument()
  })

  it('renders rightSlot when provided', () => {
    render(<CTA title="Title" rightSlot={<button>Action</button>} />)
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('renders leftSlot when provided', () => {
    render(<CTA title="Title" leftSlot={<span>Left</span>} />)
    expect(screen.getByText('Left')).toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    render(<CTA title="Title" icon={<span>Icon</span>} />)
    expect(screen.getByText('Icon')).toBeInTheDocument()
  })

  it('applies light variant classes', () => {
    const { container } = render(<CTA title="Title" variant="light" />)
    expect(container.querySelector('.bg-white')).toBeInTheDocument()
  })

  it('applies lg size classes', () => {
    const { container } = render(<CTA title="Title" size="lg" />)
    expect(container.querySelector('.text-4xl')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<CTA title="Title" className="my-custom" />)
    expect(container.firstChild).toHaveClass('my-custom')
  })
})
