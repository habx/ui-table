import * as ReactTable from 'react-table'

import { TableInstance, TableState } from '../../types/Table'

ReactTable.actions.setPagination = 'setPagination'

const reducer = <D extends {}>(
  rawState: ReactTable.TableState<D>,
  action: ReactTable.ActionType,
  rawPrevState?: ReactTable.TableState<D>,
  rawInstance?: ReactTable.TableInstance<D>
) => {
  const state = rawState as TableState<D>
  const prevState = rawPrevState as TableState<D>

  const instance = rawInstance as TableInstance<D>
  if (
    prevState?.pageIndex !== state.pageIndex ||
    prevState?.pageSize !== state.pageSize
  ) {
    instance.onPaginationChange &&
      instance.onPaginationChange({
        pageIndex: state.pageIndex,
        pageSize: state.pageSize,
      })
  }

  const getState = () => {
    switch (action.type) {
      case ReactTable.actions.setPagination: {
        return {
          ...state,
          pageSize: action.pageSize,
          pageIndex: action.pageIndex,
        }
      }

      default: {
        return state
      }
    }
  }

  return getState() as ReactTable.TableState<D>
}

const useControlledPagination = (hooks: ReactTable.Hooks<any>) => {
  hooks.stateReducers.push(reducer)
}

useControlledPagination.pluginName = 'useControlledPagination'

export default useControlledPagination
