import type { TextLabel as TextLabelProps } from "@/types"
import React from "react"
import clsx from "clsx"

const sizeMap = {
  xs: {
    dot: "w-1.5 h-1.5",
    text: "text-xs",
  },
  sm: {
    dot: "w-2 h-2",
    text: "text-sm",
  },
  md: {
    dot: "w-2.5 h-2.5",
    text: "text-base",
  },
  lg: {
    dot: "w-3 h-3",
    text: "text-lg",
  },
  xl: {
    dot: "w-3.5 h-3.5",
    text: "text-xl",
  },
}

const TextLabel: React.FC<TextLabelProps> = ({ size = "md", dot, title }) => {
  return (
    <div className="flex items-center gap-2">
      {dot && (
        <span
          className={clsx(
            "inline-block rounded-full bg-amber-800",
            sizeMap[size].dot
          )}
        />
      )}
      <p className={clsx("text-gray-800", sizeMap[size].text)}>
        {title}
      </p>
    </div>
  )
}

export default TextLabel
