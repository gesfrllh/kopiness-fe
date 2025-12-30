'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import React from 'react'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
}

const Tooltip = ({
  content,
  children,
  side = 'top',
}: TooltipProps) => {
  return (
    <TooltipPrimitive.Provider delayDuration={150}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>

        <TooltipPrimitive.Content
          side={side}
          sideOffset={6}
          className="
            z-50 rounded-md bg-black px-3 py-1.5
            text-xs text-white shadow-md
            animate-in fade-in zoom-in-95
          "
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-black" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

export default Tooltip
