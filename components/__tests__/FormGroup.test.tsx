import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import FormGroup from '@/components/Base/FormGroup'
import FormInput from '@/components/Base/FormInput'

describe('FormGroup', () => {
  it('renders label', () => {
    render(
      <FormGroup label="Username">
        <FormInput value="" onChange={() => {}} name="username" />
      </FormGroup>
    )
    expect(screen.getByText('Username')).toBeInTheDocument()
  })

  it('shows required asterisk', () => {
    render(
      <FormGroup label="Email" required>
        <FormInput value="" onChange={() => {}} name="email" />
      </FormGroup>
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('renders password toggle icon for password input', () => {
    render(
      <FormGroup label="Password">
        <FormInput value="" onChange={() => {}} name="password" type="password" />
      </FormGroup>
    )
    const icons = document.querySelectorAll('[class*="cursor-pointer"]')
    expect(icons.length).toBeGreaterThan(0)
  })

  it('floats label when input has value', () => {
    render(
      <FormGroup label="Name">
        <FormInput value="John" onChange={() => {}} name="name" />
      </FormGroup>
    )
    const label = screen.getByText('Name')
    expect(label.className).toContain('text-xs')
  })

  it('shows label at default position when input is empty', () => {
    render(
      <FormGroup label="Name">
        <FormInput value="" onChange={() => {}} name="name" />
      </FormGroup>
    )
    const label = screen.getByText('Name')
    expect(label.className).toContain('top-2.5')
  })
})
