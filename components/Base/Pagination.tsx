import { usePagination } from '@/hooks/usePagination'
import { PaginationsProps } from '@/types/pagination'
import React from 'react'

const Pagination: React.FC<PaginationsProps> = ({
  page,
  limit,
  totalData,
  totalPage: totalPageProps,
  siblingCount = 1,
  boundaryCount = 1,
  onPageChange,
  onLimitChange,
  limitOptions = [10, 20, 50, 100],
  disabled = false,
  classNames = ''
}) => {

  const totalPage = totalPageProps ?? Math.ceil(totalData / limit)

  const paginationRange = usePagination({
    page,
    totalPage,
    siblingCount,
    boundaryCount
  })

  if (totalPage <= 0) { return null }

  return (
    <div className={`flex items-center justify-between gap-4 ${classNames}`}>
      <div className="text-sm text-gray-600">
        Page <span className="font-medium">{page}</span> of{' '}
        <span className="font-medium">{totalPage}</span> ·{' '}
        {totalData} items
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={disabled || page === 1}
          onClick={() => onPageChange(1)}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          «
        </button>

        <button
          disabled={disabled || page === 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          ‹
        </button>

        {paginationRange?.map((item, idx) => {
          if (item === '...') {
            return (
              <span key={idx} className="px-2 text-gray-400">
                ...
              </span>
            );
          }

          const pageNumber = item as number;
          const isActive = pageNumber === page;

          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => onPageChange(pageNumber)}
              className={`px-3 py-1 rounded border text-sm ${isActive
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-100'
                } disabled:opacity-50`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          disabled={disabled || page === totalPage}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          ›
        </button>

        <button
          disabled={disabled || page === totalPage}
          onClick={() => onPageChange(totalPage)}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          »
        </button>

        {onLimitChange && (
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="ml-2 border rounded px-2 py-1 text-sm"
          >
            {limitOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt} / page
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
}

export default Pagination;