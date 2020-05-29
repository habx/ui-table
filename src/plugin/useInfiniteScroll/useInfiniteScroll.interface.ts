import * as React from 'react'

export interface UseInfiniteScrollInstanceProps<D extends {}> {
  infiniteScroll?: boolean
  total?: number
  loadMore?: (startIndex: number, stopIndex: number) => null | Promise<any>
  loadingRowComponent?: React.ReactElement
}

export interface UseInfiniteScrollOptions<D extends {}>
  extends UseInfiniteScrollInstanceProps<D> {}
