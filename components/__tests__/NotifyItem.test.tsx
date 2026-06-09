import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import NotifyItem from '@/components/Base/notification/NotifyItem'

describe('NotifyItem', () => {
  it('renders title and text', () => {
    render(<NotifyItem title="Success" text="Operation completed" />)
    expect(screen.getByText('Success:')).toBeInTheDocument()
    expect(screen.getByText('Operation completed')).toBeInTheDocument()
  })

  it('renders close button when dismissable', () => {
    render(<NotifyItem title="Info" text="Some info" dismissable />)
    const closeBtn = document.querySelector('[class*="notify-item__header__close"]')
    expect(closeBtn).toBeInTheDocument()
  })

  it('does not render close button when not dismissable', () => {
    render(<NotifyItem title="Info" text="Some info" dismissable={false} />)
    const closeBtn = document.querySelector('[class*="notify-item__header__close"]')
    expect(closeBtn).not.toBeInTheDocument()
  })

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(<NotifyItem title="Info" text="Some info" onClose={onClose} />)
    const closeBtn = document.querySelector('[class*="notify-item__header__close"]')
    if (closeBtn) await user.click(closeBtn)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose after duration', async () => {
    const onClose = vi.fn()
    vi.useFakeTimers()

    render(<NotifyItem title="Info" text="Auto close" duration={1000} onClose={onClose} />)

    vi.advanceTimersByTime(1000)
    expect(onClose).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  it('applies success type class', () => {
    const { container } = render(<NotifyItem type="success" title="OK" />)
    expect(container.firstChild).toHaveClass('notify-item--success')
  })

  it('applies error type class', () => {
    const { container } = render(<NotifyItem type="error" title="Error" />)
    expect(container.firstChild).toHaveClass('notify-item--error')
  })

  it('applies warning type class', () => {
    const { container } = render(<NotifyItem type="warning" title="Warning" />)
    expect(container.firstChild).toHaveClass('notify-item--warning')
  })
})
