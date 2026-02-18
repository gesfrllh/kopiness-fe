import { useState, useEffect } from 'react'
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/react-dom'

const ActionDropdown = () => {
  const [open, setOpen] = useState(false)

  const { x, y, strategy, refs, update } = useFloating({
    placement: 'bottom-end',
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })

  // Close dropdown kalau klik luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const refEl = refs.reference.current
      const floatingEl = refs.floating.current

      const target = e.target as Node

      // pastikan current ada dan HTMLElement
      const clickedOutside =
        (!refEl || !(refEl instanceof HTMLElement) || !refEl.contains(target)) &&
        (!floatingEl || !(floatingEl instanceof HTMLElement) || !floatingEl.contains(target))

      if (clickedOutside) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [refs.floating, refs.reference])

  return (
    <div className="relative inline-block text-left">
      <button
        ref={refs.setReference} // <-- pakai setReference
        onClick={() => {
          setOpen((prev) => !prev)
          update() // update posisi saat dibuka
        }}
        className="text-neutral-400 hover:text-neutral-700 text-lg px-2 py-1 rounded-md hover:bg-neutral-100 transition"
      >
        ⋯
      </button>

      {open && (
        <div
          ref={refs.setFloating} // <-- pakai setFloating
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
          className="mt-2 w-40 rounded-xl bg-white border border-neutral-200 shadow-lg z-50"
        >
          <div className="py-2 text-sm text-neutral-700 flex flex-col">
            <button className="w-full text-left px-4 py-2 cursor-pointer hover:bg-neutral-50">
              View details
            </button>
            <button className="w-full text-left px-4 py-2 cursor-pointer hover:bg-neutral-50">
              Download invoice
            </button>
            <button className="w-full text-left px-4 py-2 cursor-pointer hover:bg-neutral-50">
              Print
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActionDropdown
