// components/ThemeToggle.tsx
'use client'

import { useTheme } from '@/context/theme-context'
import { Icon } from '@iconify/react'
import Tooltip from "@/components/Base/ui/Tooltip";

export default function ThemeToggle() {
  const { theme, toggleTheme, animateSpin } = useTheme()

  return (
    <div
      className={`absolute top-2 z-50 left-4 p-4 cursor-pointer ${animateSpin ? 'animate-spin' : ''
        }`}
      onClick={toggleTheme}
    >
      {theme === 'light' ? (
        <Tooltip content="Dark">
          <Icon icon="material-symbols:moon-stars-outline" width={28} />
        </Tooltip>
      ) : (
        <Tooltip content="Light">
          <Icon icon="material-symbols:light-mode-rounded" width={28} />
        </Tooltip>
      )}
    </div>
  )
}
