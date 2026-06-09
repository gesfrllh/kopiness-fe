import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import UserTable from '@/components/users/UserTable'

const users = [
  { id: '1', name: 'Alice', email: 'alice@test.com', role: 'SUPERADMIN' as const },
  { id: '2', name: 'Bob', email: 'bob@test.com', role: 'STOREOWNER' as const },
  { id: '3', name: 'Charlie', email: 'charlie@test.com', role: 'CUSTOMER' as const },
]

describe('UserTable', () => {
  it('renders user names', () => {
    render(<UserTable users={users} />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Charlie')).toBeInTheDocument()
  })

  it('renders user emails', () => {
    render(<UserTable users={users} />)
    expect(screen.getByText('alice@test.com')).toBeInTheDocument()
    expect(screen.getByText('bob@test.com')).toBeInTheDocument()
  })

  it('renders role labels', () => {
    render(<UserTable users={users} />)
    expect(screen.getByText('Super Admin')).toBeInTheDocument()
    expect(screen.getByText('Store Owner')).toBeInTheDocument()
    expect(screen.getByText('Customer')).toBeInTheDocument()
  })

  it('renders column headers', () => {
    render(<UserTable users={users} />)
    expect(screen.getByText('Nama')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Role')).toBeInTheDocument()
  })

  it('shows empty state when no users', () => {
    render(<UserTable users={[]} />)
    expect(screen.getByText('Belum ada pengguna.')).toBeInTheDocument()
  })
})
