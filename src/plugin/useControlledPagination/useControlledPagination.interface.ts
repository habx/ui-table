export type Pagination = {
  pageSize: number
  pageIndex: number
}

export interface UseControlledPaginationOptions<D extends {}> {
  onPaginationChange?: (pagination: Pagination) => void
}

export interface UseControlledPaginationInstanceProps<D extends {}>
  extends UseControlledPaginationOptions<D> {}
