import * as React from 'react'
import * as ReactTable from 'react-table'

import { TableInstance } from '../../types/Table'

import { Pagination } from './useControlledPagination.interface'

const usePaginationEffect = <D extends {}>(
  instance: TableInstance<D>,
  pagination: Pagination | undefined
) => {
  const { dispatch, state } = instance
  React.useLayoutEffect(() => {
    if (
      pagination &&
      (state.pageIndex !== pagination.pageIndex ||
        state.pageSize !== pagination.pageSize)
    ) {
      dispatch({ type: ReactTable.actions.setPagination, ...pagination })
    }
  }, [state.pageIndex, state.pageSize, pagination, dispatch])
}

export default usePaginationEffect
