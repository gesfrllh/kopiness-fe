import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Modal } from '@/components/Base/ui/Modal/Modal'

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal open={false} onClose={() => {}}>
        <p>Content</p>
      </Modal>
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders content when open', () => {
    render(
      <Modal open={true} onClose={() => {}}>
        <p>Content</p>
      </Modal>
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders title and description', () => {
    render(
      <Modal open={true} onClose={() => {}} title="My Title" description="My Description">
        <p>Content</p>
      </Modal>
    )
    expect(screen.getByText('My Title')).toBeInTheDocument()
    expect(screen.getByText('My Description')).toBeInTheDocument()
  })

  it('renders footer', () => {
    render(
      <Modal open={true} onClose={() => {}} footer={<button>Save</button>}>
        <p>Content</p>
      </Modal>
    )
    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('calls onClose when clicking overlay', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(
      <Modal open={true} onClose={onClose}>
        <p>Content</p>
      </Modal>
    )

    const overlay = document.querySelector('.bg-black\\/50')
    expect(overlay).toBeInTheDocument()
    if (overlay) {
      await user.click(overlay)
      expect(onClose).toHaveBeenCalledTimes(1)
    }
  })

  it('calls onClose on Escape key', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(
      <Modal open={true} onClose={onClose}>
        <p>Content</p>
      </Modal>
    )

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('has dialog role and aria-modal', () => {
    render(
      <Modal open={true} onClose={() => {}}>
        <p>Content</p>
      </Modal>
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })
})
