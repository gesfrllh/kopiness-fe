'use client'

import React, { useState } from 'react'
import { User } from '@/types/auth/user'
import { showNotify } from '@/components/Base/notification/notify-controllers'
import { Bell, Lock, Eye, Trash2 } from 'lucide-react'

interface AccountSettingsProps {
  user?: User
}

const AccountSettings: React.FC<AccountSettingsProps> = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
    twoFactorEnabled: false,
  })

  const [loading, setLoading] = useState(false)

  const handleToggle = async (setting: keyof typeof settings) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setSettings((prev) => ({
        ...prev,
        [setting]: !prev[setting],
      }))

      showNotify({ type: 'success', text: 'Setting updated successfully' })
    } catch (error) {
      showNotify({ type: 'error', text: 'Failed to update setting' })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const securityOptions = [
    {
      id: 'twoFactor',
      title: '2-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      enabled: settings.twoFactorEnabled,
      icon: Lock,
    },
  ]

  const notificationOptions = [
    {
      id: 'emailNotifications',
      title: 'Email Notifications',
      description: 'Receive important account notifications via email',
      enabled: settings.emailNotifications,
      icon: Bell,
    },
    {
      id: 'orderUpdates',
      title: 'Order Updates',
      description: 'Get notified when your orders are updated',
      enabled: settings.orderUpdates,
      icon: Bell,
    },
    {
      id: 'promotions',
      title: 'Promotional Emails',
      description: 'Receive special offers and promotions',
      enabled: settings.promotions,
      icon: Bell,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Notifications Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h3>
        <div className="space-y-4">
          {notificationOptions.map((option) => {
            const Icon = option.icon
            return (
              <div key={option.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg mt-0.5">
                    <Icon className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{option.title}</p>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={option.enabled}
                    onChange={() => handleToggle(option.id as keyof typeof settings)}
                    disabled={loading}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>
            )
          })}
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Security Settings</h3>
        <div className="space-y-4">
          {securityOptions.map((option) => {
            const Icon = option.icon
            return (
              <div key={option.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-100 rounded-lg mt-0.5">
                    <Icon className="text-red-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{option.title}</p>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={option.enabled}
                    onChange={() => handleToggle(option.id as keyof typeof settings)}
                    disabled={loading}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            )
          })}
        </div>
      </div>

      {/* Privacy Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Privacy & Data</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="text-green-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-900">View Personal Data</p>
                <p className="text-sm text-gray-600">Download or view all your personal information</p>
              </div>
            </div>
            <span className="text-gray-400 group-hover:text-gray-600">→</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Eye className="text-amber-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-900">Activity Log</p>
                <p className="text-sm text-gray-600">View your recent account activity</p>
              </div>
            </div>
            <span className="text-gray-400 group-hover:text-gray-600">→</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-left group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="text-red-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-red-900">Delete Account</p>
                <p className="text-sm text-red-700">Permanently delete your account and all associated data</p>
              </div>
            </div>
            <span className="text-red-400 group-hover:text-red-600">→</span>
          </button>
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
        <h3 className="font-semibold text-green-900 mb-2">Account Status</h3>
        <p className="text-sm text-green-800 mb-4">
          Your account is secure and in good standing. All security features are up to date.
        </p>
        <ul className="space-y-2 text-sm text-green-800">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            Email verified ✓
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            No suspicious activity detected
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            Last password change: 30 days ago
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AccountSettings
