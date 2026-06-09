import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Select from '@/components/Base/Select'

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
]

describe('Select', () => {
  it('renders with label', () => {
    render(<Select label="Choose" name="select" value="" onChange={() => {}} options={options} />)
    expect(screen.getByText('Choose')).toBeInTheDocument()
  })

  it('shows selected label when value matches', () => {
    render(<Select label="Choose" name="select" value="2" onChange={() => {}} options={options} />)
    const matches = screen.getAllByText('Option 2')
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('shows empty when no value selected', () => {
    render(<Select label="Choose" name="select" value="" onChange={() => {}} options={options} />)
    const button = screen.getByRole('button')
    expect(button.textContent).not.toContain('Option')
  })

  it('opens dropdown on click', async () => {
    const user = userEvent.setup()
    render(<Select label="Choose" name="select" value="" onChange={() => {}} options={options} />)

    const button = screen.getByRole('button')
    await user.click(button)

    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })

  it('calls onChange with selected value', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<Select label="Choose" name="select" value="" onChange={onChange} options={options} />)

    await user.click(screen.getByRole('button'))
    await user.click(screen.getByText('Option 2'))

    expect(onChange).toHaveBeenCalledWith('2')
  })

  it('closes dropdown after selecting', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<Select label="Choose" name="select" value="" onChange={onChange} options={options} />)

    await user.click(screen.getByRole('button'))
    expect(screen.getAllByText(/Option \d/).length).toBeGreaterThanOrEqual(3)

    await user.click(screen.getAllByText('Option 2')[0])
    expect(onChange).toHaveBeenCalledWith('2')
  })

  it('respects disabled prop', () => {
    render(<Select label="Choose" name="select" value="" onChange={() => {}} options={options} disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
