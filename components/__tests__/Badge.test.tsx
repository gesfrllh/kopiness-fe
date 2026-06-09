import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Badge from '@/components/Base/Badge'

describe('Badge', () => {
  it('renders with text', () => {
    render(<Badge text={1} color="green" />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('applies green color class', () => {
    render(<Badge text={2} color="green" />)
    const span = screen.getByText('2')
    expect(span.className).toContain('bg-green-100')
  })

  it('applies red color class', () => {
    render(<Badge text={3} color="red" />)
    const span = screen.getByText('3')
    expect(span.className).toContain('bg-red-100')
  })

  it('applies blue color class', () => {
    render(<Badge text={4} color="blue" />)
    const span = screen.getByText('4')
    expect(span.className).toContain('bg-blue-100')
  })

  it('applies yellow color class', () => {
    render(<Badge text={5} color="yellow" />)
    const span = screen.getByText('5')
    expect(span.className).toContain('bg-yellow-100')
  })

  it('defaults to gray for unknown color', () => {
    render(<Badge text={0} color={'unknown' as 'green'} />)
    const span = screen.getByText('0')
    expect(span.className).toContain('bg-gray-100')
  })
})
