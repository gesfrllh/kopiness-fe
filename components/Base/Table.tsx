import React from 'react'
import type { TableProps } from '@/types'

const Table = <T,>({ columns, data }: TableProps<T>) => {
  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">

      {/* SCROLL WRAPPER */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-amber-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.id}
                  className="sticky top-0 z-10 bg-amber-50 px-6 py-3.5 text-left text-xs font-semibold text-amber-900 uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-14 text-center text-gray-400"
                >
                  No payment history yet ☕
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  className="group hover:bg-amber-50/50 transition-colors duration-150"
                >
                  {columns.map((col) => {
                    const value = col.accessor ? row[col.accessor] : undefined
                    return (
                      <td
                        key={col.id}
                        className="px-6 py-4 text-gray-700 whitespace-nowrap"
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
