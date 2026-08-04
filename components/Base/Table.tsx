import React from 'react'
import type { TableProps } from '@/types'

const Table = <T,>({ columns, data }: TableProps<T>) => {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] shadow-sm overflow-hidden">

      {/* SCROLL WRAPPER */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--line)]">
          <thead className="bg-[var(--surface-muted)]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.id}
                  className="sticky top-0 z-10 bg-[var(--surface-muted)] px-6 py-3.5 text-left text-xs font-semibold text-[var(--ink)] uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--line)]">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-14 text-center text-[var(--muted)]"
                >
                  No payment history yet ☕
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  className="group hover:bg-[var(--surface-muted)] transition-colors duration-150"
                >
                  {columns.map((col) => {
                    const value = col.accessor ? row[col.accessor] : undefined
                    return (
                      <td
                        key={col.id}
                        className="px-6 py-4 text-[var(--ink)] whitespace-nowrap"
                      >
                        {col.render ? col.render(value, row) : String(value ?? '')}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>

  )
}

export default Table
