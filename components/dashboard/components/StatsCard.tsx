'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: string | number
  Icon: LucideIcon
  color: string
  trend: string
  delay?: number
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, Icon, color, trend, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`bg-gradient-to-br ${color} p-3 rounded-lg shadow-md`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-semibold ${trend.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </span>
        <span className="text-gray-600 text-sm">vs last month</span>
      </div>
    </motion.div>
  )
}

export default StatsCard
