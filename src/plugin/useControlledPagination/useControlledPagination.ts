import * as ReactTable from 'react-table'

import { TableInstance, TableState } from '../../types/Table'

const useControlledState = <D extends {}>(
  state: ReactTable.TableState<D>,
  meta: ReactTable.MetaBase<D>
) => {
  const instance = meta.instance as TableInstance<D>

  const { pagination } = instance

  return {
    ...state,
    ...pagination,
  }
}

const reducer = <D extends {}>(
  rawState: ReactTable.TableState<D>,
  action: ReactTable.ActionType,
  rawPrevState?: ReactTable.TableState<D>,
  rawInstance?: ReactTable.TableInstance<D>
) => {
  const state = rawState as TableState<D>
  const prevState = rawPrevState as TableState<D>

  const instance = rawInstance as TableInstance<D>
  const initialized = !(
    !prevState?.pageIndex &&
    !prevState?.pageSize &&
    instance.pagination
  )
  if (
    initialized &&
    (prevState?.pageIndex !== state.pageIndex ||
      prevState?.pageSize !== state.pageSize)
  ) {
    instance.onPaginationChange &&
      instance.onPaginationChange({
        pageIndex: state.pageIndex,
        pageSize: state.pageSize,
      })
  }

  return state
}

const useControlledPagination = (hooks: ReactTable.Hooks<any>) => {
  hooks.stateReducers.push(reducer)
  hooks.useControlledState.push(useControlledState)
}

useControlledPagination.pluginName = 'useControlledPagination'

export default useControlledPagination
