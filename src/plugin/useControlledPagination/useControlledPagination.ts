import * as ReactTable from 'react-table'

import { TableInstance, TableState } from '../../types/Table'

const useControlledState = <D extends {}>(
  rawState: ReactTable.TableState<D>,
  meta: ReactTable.MetaBase<D>
) => {
  const instance = meta.instance as TableInstance<D>
  const state = rawState as TableState<D>
  const { pagination } = instance
  return {
    ...state,
    ...pagination,
  }
}

const useInstance = <D extends {}>(
  rawInstance: ReactTable.TableInstance<D>
) => {
  const instance = rawInstance as TableInstance<D>
  const { onPaginationChange, state } = instance
  if (onPaginationChange !== undefined) {
    instance.gotoPage = (updater) => {
      onPaginationChange({
        pageIndex:
          typeof updater === 'number' ? updater : updater(state.pageIndex),
        pageSize: instance.state.pageSize,
      })
    }
    instance.setPageSize = (pageSize: number) => {
      onPaginationChange({
        pageIndex: instance.state.pageIndex,
        pageSize,
      })
    }
  }
}

export const useControlledPagination = (hooks: ReactTable.Hooks<any>) => {
  hooks.useInstance.push(useInstance)
  hooks.useControlledState.push(useControlledState)
}

useControlledPagination.pluginName = 'useControlledPagination'
