'use client'

import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Mail, Lock, LogOut, Edit2 } from 'lucide-react'
import ProfileSection from './components/ProfileSection'
import EditProfileForm from './components/EditProfileForm'
import ChangePasswordForm from './components/ChangePasswordForm'
import AccountSettings from './components/AccountSettings'

type TabType = 'profile' | 'edit' | 'password' | 'settings'

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('profile')
  const [mounted, setMounted] = useState(false)
  const { user, logout, isHydrated } = useAuthStore()
  const router = useRouter()

  // Ensure client-side only rendering after hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if not authenticated
  useEffect(() => {
    if (mounted && isHydrated && !user) {
      router.push('/login')
    }
  }, [mounted, isHydrated, user, router])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (!mounted || !isHydrated) {
    return null // Don't render anything during SSR or hydration
  }

  if (!user) {
    return null // Will redirect in useEffect above
  }

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile', icon: User },
    { id: 'edit' as TabType, label: 'Edit Profile', icon: Edit2 },
    { id: 'password' as TabType, label: 'Password', icon: Lock },
    { id: 'settings' as TabType, label: 'Settings', icon: Mail },
  ]

  return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full space-y-8"
      >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-600 text-sm">Manage your account and preferences</p>
          </div>

          {/* Profile Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6 md:p-8 border border-amber-200"
          >
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                  <User className="text-white" size={40} />
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{user.name}</h2>
                <p className="text-amber-700 font-medium mb-2">{user.email}</p>
                <div className="flex items-center gap-3">
                  <span className="inline-block px-3 py-1 bg-amber-200 text-amber-900 text-xs font-semibold rounded-full">
                    {user.role || 'CUSTOMER'}
                  </span>
                  <span className="text-xs text-amber-800">Active Member</span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors self-start"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex gap-2 border-b border-gray-200 overflow-x-auto pb-4"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === tab.id
                    ? 'bg-amber-100 text-amber-900 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Icon size={18} />
                  <span className="text-sm">{tab.label}</span>
                </button>
              )
            })}
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'profile' && <ProfileSection user={user} />}
            {activeTab === 'edit' && <EditProfileForm user={user} />}
            {activeTab === 'password' && <ChangePasswordForm />}
            {activeTab === 'settings' && <AccountSettings user={user} />}
          </motion.div>
      </motion.div>
  )
}

export default ProfilePage
