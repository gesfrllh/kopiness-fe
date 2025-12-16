export interface BasePagination {
  page: number, 
  limit: number,
  totalData: number,
  totalPages?: number
}

export interface PaginationsProps extends BasePagination {
  siblingCount?: number,
  boundaryCount?: number,
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  limitOptions?: number[]
  disabled?: boolean,
  classNames?: string
  totalPage?: number
}