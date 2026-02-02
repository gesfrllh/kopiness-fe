import { AccordionItem, AccordionProps } from "@/types"
import AccordionItemView from "./AccordionItemView"
import React from "react"

const Accordion: React.FC<AccordionProps> = (props) => {
  const { items, multiple = false } = props
  const [openIds, setOpenIds] = React.useState<string[]>([])

  const findItem = (id: string) => {
    return items.find(item => item.id === id)
  }

  const isSelected = (id: string) => {
    if (props.selectable === 'single') {
      return props.value?.id === id
    }

    if (props.selectable === 'multiple') {
      return props.value.some(v => v.id === id)
    }

    return false
  }

  const toggleSelect = (id: string) => {
    const item = findItem(id)
    if (!item) return

    if (props.selectable === 'single') {
      props.onChange(
        props.value?.id === id ? null : item
      )
    }

    if (props.selectable === 'multiple') {
      const exists = props.value.some((v: AccordionItem) => v.id === id)

      props.onChange(
        exists
          ? props.value.filter((v: AccordionItem) => v.id !== id)
          : [...props.value, item],
      )
    }
  }

  const toggleDelete = (id: string) => {
    const item = findItem(id)
    if (!item) return

    if (props.selectable === 'single' || props.selectable === 'multiple') {
      props.onClick?.(
        props.deleteValue?.id === id ? null : item
      )
    }

  }

  const toggleOpen = (id: string) => {
    setOpenIds((prev) =>
      multiple
        ? prev.includes(id)
          ? prev.filter(i => i !== id)
          : [...prev, id]
        : prev[0] === id
          ? []
          : [id],
    )
  }

  return (
    <div className="space-y-2">
      {items.map(item => (
        <AccordionItemView
          key={item.id}
          item={item}
          title={props.title}
          isOpen={openIds.includes(item.id)}
          isSelected={isSelected(item.id)}
          selectable={props.selectable ?? false}
          onToggleOpen={() => toggleOpen(item.id)}
          onSelect={() => toggleSelect(item.id)}
          onDelete={() => toggleDelete(item.id)}
        />
      ))}
    </div>
  )
}

export default Accordion
