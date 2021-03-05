export type Pagination = {
  pageSize: number
  pageIndex: number
}

export interface UseControlledPaginationOptions {
  onPaginationChange?: (pagination: Pagination) => void
  pagination?: Pagination
  pageSizeOptions?: number[]
}

export interface UseControlledPaginationInstanceProps
  extends UseControlledPaginationOptions {}
