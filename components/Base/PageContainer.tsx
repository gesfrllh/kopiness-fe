"use client"

import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export const PageContainer = ({ children, className }: PageContainerProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={clsx('w-full space-y-6', className)}
  >
    {children}
  </motion.div>
)

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-[var(--ink)]">{title}</h1>
      {subtitle && (
        <p className="text-sm text-[var(--muted)] mt-1">{subtitle}</p>
      )}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
)

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: boolean
}

export const Card = ({ children, className, padding = true }: CardProps) => (
  <div className={clsx('bg-[var(--surface)] rounded-xl border border-[var(--line)]', padding && 'p-4 md:p-6', className)}>
    {children}
  </div>
)

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export const CardHeader = ({ title, subtitle, action }: CardHeaderProps) => (
  <div className="flex items-center justify-between gap-4 mb-4">
    <div>
      <h3 className="text-base font-semibold text-[var(--ink)]">{title}</h3>
      {subtitle && <p className="text-xs text-[var(--muted)] mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
)

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: string
  trendUp?: boolean
}

export const StatCard = ({ label, value, icon, trend, trendUp }: StatCardProps) => (
  <Card>
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-sm text-[var(--muted)] font-medium">{label}</p>
        <p className="text-2xl md:text-3xl font-bold text-[var(--ink)]">{value}</p>
        {trend && (
          <p className={clsx('text-xs font-medium', trendUp ? 'text-green-600' : 'text-red-500')}>
            {trend}
          </p>
        )}
      </div>
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#BD6230] to-[#8B4513] flex items-center justify-center text-white shadow-sm flex-shrink-0">
        {icon}
      </div>
    </div>
  </Card>
)
