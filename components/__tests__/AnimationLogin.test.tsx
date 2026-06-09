import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AnimationLogin from '@/components/animation/AnimationLogin'

describe('AnimationLogin', () => {
  it('renders loader elements', () => {
    const { container } = render(<AnimationLogin />)
    expect(container.querySelector('.loader-overlay')).toBeInTheDocument()
    expect(container.querySelector('.loader')).toBeInTheDocument()
  })
})
