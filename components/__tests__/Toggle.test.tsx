import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Toggle from '@/components/Base/Toggle'

describe('Toggle', () => {
  it('renders with label', () => {
    render(<Toggle checked={false} onChange={() => {}} label="Dark Mode" />)
    expect(screen.getByText('Dark Mode')).toBeInTheDocument()
  })

  it('shows checked state correctly', () => {
    render(<Toggle checked={true} onChange={() => {}} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('shows unchecked state correctly', () => {
    render(<Toggle checked={false} onChange={() => {}} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })

  it('calls onChange with true when toggled from false', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<Toggle checked={false} onChange={onChange} />)
    await user.click(screen.getByRole('switch'))

    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('calls onChange with false when toggled from true', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<Toggle checked={true} onChange={onChange} />)
    await user.click(screen.getByRole('switch'))

    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('does not call onChange when disabled', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<Toggle checked={false} onChange={onChange} disabled />)
    await user.click(screen.getByRole('switch'))

    expect(onChange).not.toHaveBeenCalled()
  })

  it('renders with disabled styles', () => {
    render(<Toggle checked={false} onChange={() => {}} disabled />)
    expect(screen.getByRole('switch')).toBeDisabled()
  })

  it('renders label on the left', () => {
    render(
      <Toggle checked={false} onChange={() => {}} label="Left" labelPosition="left" />
    )
    const label = screen.getByText('Left')
    const switchBtn = screen.getByRole('switch')
    expect(label.compareDocumentPosition(switchBtn)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  it('renders primary variant when checked', () => {
    render(<Toggle checked={true} onChange={() => {}} variant="primary" />)
    const btn = screen.getByRole('switch')
    expect(btn.className).toContain('bg-amber-600')
  })
})
