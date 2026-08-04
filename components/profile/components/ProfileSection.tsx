'use client'

import React from 'react'
import { Icon } from '@iconify/react'
import { User } from '@/types/auth/user'
import { Card } from '@/components/Base/PageContainer'

interface ProfileSectionProps {
  user: User
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user }) => {
  const profileStats = [
    { icon: 'mdi:email', label: 'Email', value: user.email },
    { icon: 'mdi:shield-account', label: 'Role', value: user.role || 'CUSTOMER', badge: true },
    { icon: 'mdi:check-decagram', label: 'Account Status', value: 'Active', badge: true, badgeColor: 'green' },
  ]

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {profileStats.map((stat, idx) => (
          <Card key={idx}>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-[rgba(189,98,48,0.08)] text-[#BD6230]">
                <Icon icon={stat.icon} width={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#7F7E77] text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-[#2D2D2D] font-semibold text-lg break-words truncate">{stat.value}</p>
                {stat.badge && (
                  <div className="mt-2">
                    <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold ${stat.badgeColor === 'green' ? 'bg-green-100 text-green-700' : 'bg-[rgba(189,98,48,0.1)] text-[#BD6230]'}`}>
                      {stat.value.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-[#FBFAF9] to-[rgba(189,98,48,0.03)]">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-[rgba(189,98,48,0.08)] text-[#BD6230] flex-shrink-0">
            <Icon icon="mdi:information" width={22} />
          </div>
          <div>
            <h3 className="font-semibold text-[#2D2D2D] mb-2">Account Information</h3>
            <p className="text-[#7F7E77] text-sm leading-relaxed">
              Your account is in good standing. You can edit your profile information, change your password, and manage your account settings from the tabs above.
            </p>
            <div className="mt-4 pt-4 border-t border-[#DCD9D5]">
              <p className="text-xs text-[#7F7E77]">
                <strong>Note:</strong> Keep your personal information and password secure. Never share them with anyone.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-[#2D2D2D] mb-3">Privacy & Security</h3>
        <ul className="space-y-2 text-sm text-[#7F7E77]">
          {[
            'Your data is encrypted and securely stored',
            'We never share your personal information with third parties',
            'You have full control over your account settings',
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">✓</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

export default ProfileSection
