import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Pagination from '@/components/Base/Pagination'

describe('Pagination', () => {
  it('renders page info text', () => {
    render(
      <Pagination
        page={2}
        limit={10}
        totalData={50}
        totalPage={5}
        onPageChange={() => {}}
      />
    )
    expect(screen.getByText(/50 items/)).toBeInTheDocument()
    const pageSpan = screen.getByText((content, element) =>
      element?.tagName === 'SPAN' && element.className.includes('font-medium') && content === '2'
    )
    expect(pageSpan).toBeInTheDocument()
  })

  it('renders page buttons', () => {
    render(
      <Pagination
        page={1}
        limit={10}
        totalData={30}
        totalPage={3}
        onPageChange={() => {}}
      />
    )
    const buttons = screen.getAllByRole('button').filter(b => /^\d+$/.test(b.textContent ?? ''))
    expect(buttons).toHaveLength(3)
    expect(buttons[0]).toHaveTextContent('1')
    expect(buttons[1]).toHaveTextContent('2')
    expect(buttons[2]).toHaveTextContent('3')
  })

  it('calls onPageChange when clicking a page', async () => {
    const onPageChange = vi.fn()
    const user = userEvent.setup()

    render(
      <Pagination
        page={1}
        limit={10}
        totalData={30}
        totalPage={3}
        onPageChange={onPageChange}
      />
    )

    await user.click(screen.getByText('2'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('disables previous buttons on first page', () => {
    render(
      <Pagination
        page={1}
        limit={10}
        totalData={30}
        totalPage={3}
        onPageChange={() => {}}
      />
    )

    const buttons = screen.getAllByRole('button')
    const firstBtn = buttons[0]
    const prevBtn = buttons[1]
    expect(firstBtn).toBeDisabled()
    expect(prevBtn).toBeDisabled()
  })

  it('returns null when totalPage is 0', () => {
    const { container } = render(
      <Pagination
        page={1}
        limit={10}
        totalData={0}
        totalPage={0}
        onPageChange={() => {}}
      />
    )
    expect(container.innerHTML).toBe('')
  })
})
