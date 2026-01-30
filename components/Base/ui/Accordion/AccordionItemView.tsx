import React, { useEffect, useRef, useState } from 'react'

type Props = {
  title: React.ReactNode
  item: {
    content: React.ReactNode
  }
  isOpen: boolean
  isSelected: boolean
  selectable: 'single' | 'multiple' | false
  onToggleOpen: () => void
  onSelect: () => void
}

const AccordionItemView: React.FC<Props> = ({
  item,
  title,
  isOpen,
  isSelected,
  selectable,
  onToggleOpen,
  onSelect,
}) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [maxHeight, setMaxHeight] = useState<number>(0)

  useEffect(() => {
    if (!contentRef.current) return
    setMaxHeight(isOpen ? contentRef.current.scrollHeight : 0)
  }, [isOpen, item.content])

  return (
    <div
      className={`border shadow-[8px_6px_0px_1px_#422900] bg-colors-var rounded-lg overflow-hidden mb-4 ${isSelected ? 'border-amber-800' : ''
        }`}
    >
      {/* HEADER */}
      <div className="flex items-center gap-2 px-4 py-3">
        {selectable && (
          <input
            type={selectable === 'single' ? 'radio' : 'checkbox'}
            checked={isSelected}
            onChange={() => {
              onSelect()
              onToggleOpen() // 🔥 buka accordion saat dipilih
            }}
          />
        )}

        <button
          onClick={onToggleOpen}
          className="flex-1 text-left font-medium cursor-pointer"
        >
          {title}
        </button>
      </div>

      {/* CONTENT */}
      <div
        style={{ maxHeight }}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      >
        <div ref={contentRef} className="px-4 pb-4">
          {item.content}
        </div>
      </div>
    </div>
  )
}

export default AccordionItemView
