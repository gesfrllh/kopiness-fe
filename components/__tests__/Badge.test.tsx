import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Badge from '@/components/Base/Badge'

describe('Badge', () => {
  it('renders with text', () => {
    render(<Badge text="Active" color="green" />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('applies green color class', () => {
    render(<Badge text="Success" color="green" />)
    expect(screen.getByText('Success').className).toContain('bg-green-100')
  })

  it('applies red color class', () => {
    render(<Badge text="Failed" color="red" />)
    expect(screen.getByText('Failed').className).toContain('bg-red-100')
  })

  it('applies blue color class', () => {
    render(<Badge text="Info" color="blue" />)
    expect(screen.getByText('Info').className).toContain('bg-blue-100')
  })

  it('applies yellow color class', () => {
    render(<Badge text="Warning" color="yellow" />)
    expect(screen.getByText('Warning').className).toContain('bg-yellow-100')
  })

  it('defaults to gray for unknown color', () => {
    render(<Badge text="Default" color={'unknown' as any} />)
    expect(screen.getByText('Default').className).toContain('bg-gray-100')
  })
})
