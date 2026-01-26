import React from 'react'
import type { TableProps } from '@/types'

const Table = <T,>({ columns, data }: TableProps<T>) => {
  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-300">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columns.map((item) => (
                <th
                  key={item.id}
                  className="border border-gray-300 p-2 text-left bg-gray-200"
                >
                  {item.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-2 text-center">
                  No Data Available
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="border-b">
                  {columns.map((col) => {
                    const value = col.accessor ? row[col.accessor] : undefined

                    return (
                      <td key={col.id} className="border border-gray-300 p-2">
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

    </>
  )
}

export default Table