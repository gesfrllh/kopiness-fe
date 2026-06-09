import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ModalHeader, ModalBody, ModalFooter } from '@/components/Base/ui/Modal/ModalCompunds'

describe('ModalHeader', () => {
  it('renders children', () => {
    render(<ModalHeader><h1>Header</h1></ModalHeader>)
    expect(screen.getByText('Header')).toBeInTheDocument()
  })
})

describe('ModalBody', () => {
  it('renders children', () => {
    render(<ModalBody><p>Body</p></ModalBody>)
    expect(screen.getByText('Body')).toBeInTheDocument()
  })
})

describe('ModalFooter', () => {
  it('renders children', () => {
    render(<ModalFooter><button>Action</button></ModalFooter>)
    expect(screen.getByText('Action')).toBeInTheDocument()
  })
})
