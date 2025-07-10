import React from 'react'

export type Column<T> = {
  header: string,
  key: keyof T,
  render?: (value: unknown, row: T) => React.ReactNode
}

type TableProps<T> = {
  columns: Column<T>[],
  data: T[]
}

const Table = <T,>({ columns, data }: TableProps<T>) => {
  return (
    <>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            {columns.map((item) => (
              <th
                key={String(item.key)}
                style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}
              >
                {item.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: '8px', textAlign: 'center' }}>
                No Data Available
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    style={{ border: '1px solid #ccc', padding: '8px' }}
                  >
                    {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  )
}

export default Table