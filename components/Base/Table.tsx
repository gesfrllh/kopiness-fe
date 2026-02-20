import React from 'react'
import type { TableProps } from '@/types'

const Table = <T,>({ columns, data }: TableProps<T>) => {
  return (
    <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm">

      {/* SCROLL WRAPPER */}
      <div className="overflow-y-auto max-h-[calc(4*7rem)]">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.id}
                  className="px-6 py-3 text-left text-sm font-medium text-neutral-500"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-14 text-center text-neutral-400"
                >
                  No payment history yet ☕
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  className="group hover:bg-neutral-50 transition-colors duration-150"
                >
                  {columns.map((col) => {
                    const value = col.accessor ? row[col.accessor] : undefined
                    return (
                      <td
                        key={col.id}
                        className="px-6 py-4 text-neutral-700 whitespace-nowrap"
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
