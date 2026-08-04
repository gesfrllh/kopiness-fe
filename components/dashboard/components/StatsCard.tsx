'use client'

import React from 'react'

interface StatsCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  color: string
  trend: string
  delay?: number
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, color, trend, delay = 0 }) => {
  return (
    <div
      className="bg-[#FBFAF9] rounded-xl border border-[#DCD9D5] p-6 hover:shadow-md transition-all duration-200"
      style={{ animation: `slideUp 0.4s ease-out ${delay}s forwards`, opacity: 0 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[#7F7E77] text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-[#2D2D2D] mt-2">{value}</p>
        </div>
        <div className={`bg-gradient-to-br ${color} p-3 rounded-xl shadow-sm`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-semibold ${trend.includes('+') ? 'text-green-600' : 'text-red-500'}`}>
          {trend}
        </span>
        <span className="text-[#7F7E77] text-sm">vs last month</span>
      </div>
    </div>
  )
}

export default StatsCard
