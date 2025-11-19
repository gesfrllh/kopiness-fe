import { BadgeInterface } from '@/types'
import React from 'react'

const Badge: React.FC<BadgeInterface> = ({ text, color }) => {

  const generateColor = () => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-800'
      case 'red':
        return 'bg-red-100 text-red-800'
      case 'blue':
        return 'bg-blue-100 text-blue-800'
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800'
      case 'gray':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div>
      <span
        className={`px-2 py-1 text-sm font-medium rounded-full ${generateColor()}`}
      >
        {text}
      </span>
    </div>
  )
}

export default Badge
