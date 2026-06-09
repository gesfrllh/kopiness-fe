'use client'

import { User } from '@/types/auth/user'
import { useMemo } from 'react'
import type { Column } from '@/types'
import Table from '@/components/Base/Table'
interface Props {
  users: User[]
}

const roleLabel: Record<string, string> = {
  SUPERADMIN: 'Super Admin',
  STOREOWNER: 'Store Owner',
  CUSTOMER: 'Customer',
}

const roleStyle: Record<string, string> = {
  SUPERADMIN: 'bg-blue-100 text-blue-800',
  STOREOWNER: 'bg-yellow-100 text-yellow-800',
  CUSTOMER: 'bg-green-100 text-green-800',
}

const UserTable = ({ users }: Props) => {
  const columns: Column<User>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Nama',
      accessor: 'name',
      render: val => <span className="font-medium text-gray-900">{val as string}</span>,
    },
    {
      id: 'email',
      header: 'Email',
      accessor: 'email',
      render: val => <span className="text-gray-700">{val as string}</span>,
    },
    {
      id: 'role',
      header: 'Role',
      accessor: 'role',
      render: val => (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${roleStyle[val as string]}`}>
          {roleLabel[val as string]}
        </span>
      ),
    }
  ], [])

  if (users.length === 0) {
    return (
      <div className="text-center py-16 text-muted">
        Belum ada pengguna.
      </div>
    )
  }

  return <Table columns={columns} data={users} />
}

export default UserTable
