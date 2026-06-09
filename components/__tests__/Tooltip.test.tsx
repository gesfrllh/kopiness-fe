import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Tooltip from '@/components/Base/ui/Tooltip'

describe('Tooltip', () => {
  it('renders children', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    )
    expect(screen.getByText('Hover me')).toBeInTheDocument()
  })
})
