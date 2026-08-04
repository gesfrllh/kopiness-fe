'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import CTA from '@/components/Base/cta'
import Button from '@/components/Base/Button'
import UserTable from '@/components/users/UserTable'
import CreateUserModal from '@/components/users/CreateUserModal'
import { useUserManagementStore } from '@/store/useUserManagementStore'
import AnimationLogin from '@/components/animation/AnimationLogin'

const UserManagementPage = () => {
  const [openModal, setOpenModal] = useState(false)
  const { users, loading, fetchUsers } = useUserManagementStore()

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <div className="space-y-6">
      <CTA
        title="Kelola Pengguna"
        subtitle="Super admin — tambah dan kelola store owner"
        size="md"
        variant="gradient"
        icon={<Icon icon="mdi:users-group" width={24} />}
        rightSlot={
          <Button
            className="bg-white text-amber-900 hover:bg-amber-50 flex items-center gap-1"
            onClick={() => setOpenModal(true)}
          >
            <Icon icon="mdi:plus" width={20} className="mr-1" />
            Tambah Store Owner
          </Button>
        }
      />

      <div className="bg-white rounded-2xl shadow-sm xp-6">
        {loading ? <AnimationLogin /> : <UserTable users={users} />}
      </div>

      <CreateUserModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => undefined}
      />
    </div>
  )
}

export default UserManagementPage
