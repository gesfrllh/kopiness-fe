import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StoreCard from '@/components/stores/StoreCard'

const mockStore = {
  id: '1',
  name: 'Kopi Nusantara',
  slug: 'kopi-nusantara',
  address: 'Jl. Merdeka No. 1',
}

describe('StoreCard', () => {
  it('renders store name', () => {
    render(<StoreCard store={mockStore} />)
    expect(screen.getByText('Kopi Nusantara')).toBeInTheDocument()
  })

  it('renders store address', () => {
    render(<StoreCard store={mockStore} />)
    expect(screen.getByText('Jl. Merdeka No. 1')).toBeInTheDocument()
  })

  it('links to store detail page', () => {
    render(<StoreCard store={mockStore} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/manage/stores/kopi-nusantara')
  })
})
