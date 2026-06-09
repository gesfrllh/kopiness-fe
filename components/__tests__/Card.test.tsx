import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CardRoot from '@/components/Base/ui/Card/Card'
import CardContent from '@/components/Base/ui/Card/CardContent'
import CardFooter from '@/components/Base/ui/Card/CardFooter'
import CardTitle from '@/components/Base/ui/Card/CardTitle'
import CardPrice from '@/components/Base/ui/Card/CardPrice'
import CardImage from '@/components/Base/ui/Card/CardImage'
import CardCompound from '@/components/Base/ui/Card'

describe('CardRoot', () => {
  it('renders children', () => {
    render(<CardRoot><p>Card content</p></CardRoot>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<CardRoot className="custom-class"><p>Content</p></CardRoot>)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})

describe('CardContent', () => {
  it('renders children', () => {
    render(<CardContent><span>Content area</span></CardContent>)
    expect(screen.getByText('Content area')).toBeInTheDocument()
  })
})

describe('CardFooter', () => {
  it('renders children', () => {
    render(<CardFooter><button>Action</button></CardFooter>)
    expect(screen.getByText('Action')).toBeInTheDocument()
  })
})

describe('CardTitle', () => {
  it('renders title', () => {
    render(<CardTitle title="Product Name" />)
    expect(screen.getByText('Product Name')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<CardTitle title="Product" subtitle="Category" />)
    expect(screen.getByText('Category')).toBeInTheDocument()
  })

  it('does not render subtitle when not provided', () => {
    const { container } = render(<CardTitle title="Product" />)
    expect(container.querySelectorAll('span')).toHaveLength(1)
  })
})

describe('CardPrice', () => {
  it('formats and renders price', () => {
    render(<CardPrice value={25000} />)
    expect(screen.getByText(/Rp.*25\.000/)).toBeInTheDocument()
  })
})

describe('CardImage', () => {
  it('renders image with alt text', () => {
    const { container } = render(<CardImage src="/test.jpg" alt="Test image" />)
    expect(container.querySelector('[alt="Test image"]')).toBeInTheDocument()
  })
})

describe('CardCompound', () => {
  it('has compound subcomponents', () => {
    expect(CardCompound.image).toBeDefined()
    expect(CardCompound.content).toBeDefined()
    expect(CardCompound.title).toBeDefined()
    expect(CardCompound.price).toBeDefined()
    expect(CardCompound.footer).toBeDefined()
  })
})
