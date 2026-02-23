import { usePagination } from '@/hooks/usePagination'
import { PaginationsProps } from '@/types/pagination'
import React from 'react'
import Select from './Select'

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
      <div className="text-sm theme-text">
        Page <span className="font-medium">{page}</span> of{' '}
        <span className="font-medium">{totalPage}</span> ·{' '}
        {totalData} items
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={disabled || page === 1}
          onClick={() => onPageChange(1)}
          className="px-3 py-2 rounded theme-border disabled:opacity-50"
        >
          «
        </button>

        <button
          disabled={disabled || page === 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-2 rounded theme-border disabled:opacity-50"
        >
          ‹
        </button>

        {paginationRange?.map((item, idx) => {
          if (item === '...') {
            return (
              <span key={idx} className="px-2 text-muted">
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
              className={`px-3 py-2 rounded theme-border text-sm ${isActive
                ? 'bg-primary text-white'
                : 'hover:bg-primary-700 hover:text-white'
                } disabled:opacity-50`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          disabled={disabled || page === totalPage}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-2 rounded theme-border disabled:opacity-50"
        >
          ›
        </button>

        <button
          disabled={disabled || page === totalPage}
          onClick={() => onPageChange(totalPage)}
          className="px-3 py-2 rounded theme-border disabled:opacity-50"
        >
          »
        </button>

        {onLimitChange && (
          <Select
            label='limit'
            name='pagination'
            value={String(limit)}
            options={limitOptions.map((opt) => ({
              label: `${opt} / page`,
              value: `${String(opt)}`
            }))}
            onChange={(val) => onLimitChange(Number(val))}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  )
}

export default Pagination;