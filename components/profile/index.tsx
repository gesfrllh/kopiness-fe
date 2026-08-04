'use client'

import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import ProfileSection from './components/ProfileSection'
import EditProfileForm from './components/EditProfileForm'
import ChangePasswordForm from './components/ChangePasswordForm'
import AccountSettings from './components/AccountSettings'
import { PageContainer, PageHeader, Card } from '@/components/Base/PageContainer'

type TabType = 'profile' | 'edit' | 'password' | 'settings'

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('profile')
  const [mounted, setMounted] = useState(false)
  const { user, logout, isHydrated } = useAuthStore()
  const router = useRouter()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (mounted && isHydrated && !user) router.push('/login')
  }, [mounted, isHydrated, user, router])

  const handleLogout = async () => {
    try { await logout(); router.push('/login') }
    catch (error) { console.error('Logout failed:', error) }
  }

  if (!mounted || !isHydrated || !user) return null

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile', icon: 'mdi:account-circle' },
    { id: 'edit' as TabType, label: 'Edit Profile', icon: 'mdi:pencil' },
    { id: 'password' as TabType, label: 'Password', icon: 'mdi:lock' },
    { id: 'settings' as TabType, label: 'Settings', icon: 'mdi:cog' },
  ]

  return (
    <PageContainer>
      <PageHeader
        title="Profile Settings"
        subtitle="Manage your account and preferences"
      />

      {/* Profile Header */}
      <Card className="bg-gradient-to-br from-[#FBFAF9] to-[rgba(189,98,48,0.04)]">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="relative">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#BD6230] to-[#8B4513] flex items-center justify-center shadow-lg">
              <Icon icon="mdi:account" width={36} className="text-white" />
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-[#FBFAF9]" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl md:text-2xl font-bold text-[#2D2D2D] mb-1 truncate">{user.name}</h2>
            <p className="text-[#BD6230] font-medium text-sm mb-2 truncate">{user.email}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 bg-[rgba(189,98,48,0.1)] text-[#BD6230] text-xs font-semibold rounded-full">
                {user.role || 'CUSTOMER'}
              </span>
              <span className="text-xs text-[#7F7E77]">Active Member</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-all text-sm font-medium self-start flex-shrink-0"
          >
            <Icon icon="mdi:logout" width={16} />
            Logout
          </button>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#DCD9D5] overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm transition-all whitespace-nowrap border-b-2 -mb-px ${activeTab === tab.id
              ? 'border-[#BD6230] text-[#BD6230] font-semibold'
              : 'border-transparent text-[#7F7E77] hover:text-[#2D2D2D] hover:border-[#DCD9D5]'
            }`}
          >
            <Icon icon={tab.icon} width={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div key={activeTab}>
        {activeTab === 'profile' && <ProfileSection user={user} />}
        {activeTab === 'edit' && <EditProfileForm user={user} />}
        {activeTab === 'password' && <ChangePasswordForm />}
        {activeTab === 'settings' && <AccountSettings user={user} />}
      </div>
    </PageContainer>
  )
}

export default ProfilePage
