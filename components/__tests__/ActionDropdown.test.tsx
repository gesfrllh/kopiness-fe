import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ActionDropdown from '@/components/history/components/ActionDropdown'

describe('ActionDropdown', () => {
  const actions = [
    { title: 'Details', onClick: vi.fn() },
    { title: 'Print', onClick: vi.fn() },
  ]

  it('renders trigger button', () => {
    render(<ActionDropdown item={actions} />)
    expect(screen.getByText('⋯')).toBeInTheDocument()
  })

  it('shows dropdown on trigger click', async () => {
    const user = userEvent.setup()
    render(<ActionDropdown item={actions} />)

    await user.click(screen.getByText('⋯'))
    expect(screen.getByText('Details')).toBeInTheDocument()
    expect(screen.getByText('Print')).toBeInTheDocument()
  })

  it('calls action onClick when item clicked', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    render(<ActionDropdown item={[{ title: 'Details', onClick }]} />)

    await user.click(screen.getByText('⋯'))
    await user.click(screen.getByText('Details'))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('keeps dropdown open after clicking an item (closes on outside click)', async () => {
    const user = userEvent.setup()

    render(<ActionDropdown item={[{ title: 'Details', onClick: () => {} }]} />)

    await user.click(screen.getByText('⋯'))
    await user.click(screen.getByText('Details'))

    expect(screen.getByText('Details')).toBeInTheDocument()
  })
})
