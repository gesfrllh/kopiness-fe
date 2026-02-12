'use client'

import React from 'react'
import clsx from 'clsx'

type ToggleSize = 'sm' | 'md' | 'lg'
type ToggleVariant = 'default' | 'primary' | 'success' | 'danger'
type LabelPosition = 'left' | 'right' | 'top' | 'bottom'

interface ToggleProps {
  checked: boolean
  onChange: (value: boolean) => void
  label?: React.ReactNode
  labelPosition?: LabelPosition
  size?: ToggleSize
  variant?: ToggleVariant
  disabled?: boolean
  className?: string
}

const sizeClasses: Record<ToggleSize, {
  track: string
  thumb: string
  translate: string
}> = {
  sm: {
    track: 'h-5 w-9',
    thumb: 'h-3 w-3',
    translate: 'translate-x-4'
  },
  md: {
    track: 'h-6 w-11',
    thumb: 'h-4 w-4',
    translate: 'translate-x-6'
  },
  lg: {
    track: 'h-7 w-14',
    thumb: 'h-5 w-5',
    translate: 'translate-x-8'
  }
}

const variantColors: Record<ToggleVariant, string> = {
  default: 'bg-gray-600',
  primary: 'bg-amber-600',
  success: 'bg-green-600',
  danger: 'bg-red-600'
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  labelPosition = 'right',
  size = 'md',
  variant = 'primary',
  disabled = false,
  className
}) => {
  const sizeConfig = sizeClasses[size]

  const renderLabel = label && (
    <span className="text-md font-medium text-gray-700">
      {label}
    </span>
  )

  const switchButton = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={clsx(
        "relative inline-flex items-center rounded-full transition-colors duration-200",
        sizeConfig.track,
        checked ? variantColors[variant] : 'bg-gray-300',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span
        className={clsx(
          "inline-block transform rounded-full bg-white transition-transform duration-200",
          sizeConfig.thumb,
          checked ? sizeConfig.translate : 'translate-x-1'
        )}
      />
    </button>
  )

  const layout =
    labelPosition === 'top'
      ? 'flex flex-col gap-2'
      : labelPosition === 'bottom'
        ? 'flex flex-col-reverse gap-2'
        : 'flex items-center gap-3'

  return (
    <div className={clsx(layout, className)}>
      {(labelPosition === 'left' || labelPosition === 'top') && renderLabel}
      {switchButton}
      {(labelPosition === 'right' || labelPosition === 'bottom') && renderLabel}
    </div>
  )
}

export default Toggle
