import * as React from 'react'

export interface UseInfiniteScrollInstanceProps {
  infiniteScroll?: boolean
  total?: number
  loadMore?: (startIndex: number, stopIndex: number) => void | Promise<void>
  loadingRowComponent?: React.ReactElement
}

export interface UseInfiniteScrollOptions
  extends UseInfiniteScrollInstanceProps {}
