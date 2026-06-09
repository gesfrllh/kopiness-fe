import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Table from '@/components/Base/Table'
import type { Column } from '@/types'

describe('Table', () => {
  const columns: Column<{ name: string; age: number }>[] = [
    { id: 'name', header: 'Name', accessor: 'name' },
    { id: 'age', header: 'Age', accessor: 'age' },
  ]

  it('renders column headers', () => {
    render(<Table columns={columns} data={[]} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Age')).toBeInTheDocument()
  })

  it('renders data rows', () => {
    const data = [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }]
    render(<Table columns={columns} data={data} />)

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
  })

  it('shows empty state when no data', () => {
    render(<Table columns={columns} data={[]} />)
    expect(screen.getByText(/No payment history yet/i)).toBeInTheDocument()
  })

  it('uses custom render function', () => {
    const cols: Column<{ name: string }>[] = [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name',
        render: (value: unknown) => `Mr. ${value as string}`,
      },
    ]
    render(<Table columns={cols} data={[{ name: 'Smith' }]} />)
    expect(screen.getByText('Mr. Smith')).toBeInTheDocument()
  })
})
