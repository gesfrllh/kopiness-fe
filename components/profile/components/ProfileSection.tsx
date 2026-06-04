'use client'

import React from 'react'
import { User } from '@/types/auth/user'
import { Mail, Shield, Award } from 'lucide-react'

interface ProfileSectionProps {
  user: User
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user }) => {
  const profileStats = [
    {
      icon: Mail,
      label: 'Email',
      value: user.email,
    },
    {
      icon: Shield,
      label: 'Role',
      value: user.role || 'CUSTOMER',
      badge: true,
    },
    {
      icon: Award,
      label: 'Account Status',
      value: 'Active',
      badge: true,
      badgeColor: 'green',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Profile Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profileStats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Icon className="text-amber-900" size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-gray-900 font-semibold text-lg break-words">
                    {stat.value}
                  </p>
                  {stat.badge && (
                    <div className="mt-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${stat.badgeColor === 'green'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-900'
                          }`}
                      >
                        {stat.value.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Account Activity Info */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-200 rounded-lg flex-shrink-0">
            <Award className="text-blue-900" size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Account Information</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              Your account is in good standing. You can edit your profile information, change your password, and manage your account settings from the tabs above.
            </p>
            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong> Keep your personal information and password secure. Never share them with anyone.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Privacy & Security</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">✓</span>
            <span>Your data is encrypted and securely stored</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">✓</span>
            <span>We never share your personal information with third parties</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold mt-0.5">✓</span>
            <span>You have full control over your account settings</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ProfileSection
