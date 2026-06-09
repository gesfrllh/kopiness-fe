import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import FormInput from '@/components/Base/FormInput'

describe('FormInput', () => {
  it('renders text input with value', () => {
    render(<FormInput value="test" onChange={() => {}} name="test" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('test')
  })

  it('renders checkbox mode', () => {
    render(<FormInput type="checkbox" value={true} onChange={() => {}} name="check" />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('shows checked state in checkbox mode', () => {
    render(<FormInput type="checkbox" value={true} onChange={() => {}} name="check" />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('shows unchecked state in checkbox mode', () => {
    render(<FormInput type="checkbox" value={false} onChange={() => {}} name="check" />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('renders with placeholder', () => {
    render(<FormInput value="" onChange={() => {}} name="test" placeholder="Enter name" />)
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument()
  })
})

describe('FormInput debounce', () => {
  it('calls onChange after debounce delay', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(<FormInput value="" onChange={onChange} name="test" />)
    const input = screen.getByRole('textbox')

    await user.type(input, 'a')
    expect(onChange).not.toHaveBeenCalled()

    await vi.waitFor(() => expect(onChange).toHaveBeenCalled(), { timeout: 1000 })
  })
})
