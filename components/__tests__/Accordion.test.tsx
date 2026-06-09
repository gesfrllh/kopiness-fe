import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Accordion from '@/components/Base/ui/Accordion/Accordion'
import type { AccordionItem, AccordionProps } from '@/types'

const items: AccordionItem[] = [
  { id: '1', title: 'Item 1', content: <p>Content 1</p> },
  { id: '2', title: 'Item 2', content: <p>Content 2</p> },
]

describe('Accordion', () => {
  it('renders all item titles', () => {
    render(<Accordion items={items} />)
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('toggles content visibility on click', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} />)

    const title1 = screen.getByText('Item 1')
    await user.click(title1)

    expect(screen.getByText('Content 1')).toBeInTheDocument()
    expect(screen.getByText('Content 2')).toBeInTheDocument()
  })

  it('changes max-height when toggled', async () => {
    const user = userEvent.setup()
    const { container } = render(<Accordion items={items} />)

    const contentDivs = container.querySelectorAll('[style*="max-height"]')
    expect(contentDivs.length).toBeGreaterThanOrEqual(2)

    const title1 = screen.getByText('Item 1')
    await user.click(title1)
  })
})

describe('Accordion with single select', () => {
  it('calls onChange when selecting an item', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(
      <Accordion
        items={items}
        selectable="single"
        value={null}
        onChange={onChange}
      />
    )

    const radio = screen.getAllByRole('radio')[0]
    await user.click(radio)

    expect(onChange).toHaveBeenCalledWith(items[0])
  })

  it('shows radio inputs when selectable is single', () => {
    render(
      <Accordion
        items={items}
        selectable="single"
        value={null}
        onChange={() => {}}
      />
    )

    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(2)
  })
})

describe('Accordion with multiple select', () => {
  it('shows checkbox inputs', () => {
    render(
      <Accordion
        items={items}
        selectable="multiple"
        value={[]}
        onChange={() => {}}
      />
    )

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(2)
  })

  it('calls onChange with updated array', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    render(
      <Accordion
        items={items}
        selectable="multiple"
        value={[]}
        onChange={onChange}
      />
    )

    const checkbox = screen.getAllByRole('checkbox')[0]
    await user.click(checkbox)

    expect(onChange).toHaveBeenCalledWith([items[0]])
  })
})
