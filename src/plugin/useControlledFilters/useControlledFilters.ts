import { isEqual } from 'lodash'
import * as ReactTable from 'react-table'

import { TableInstance, TableState } from '../../types/Table'

const EMPTY_FILTERS: any[] = []

const useControlledState = <D extends {}>(
  rawState: ReactTable.TableState<D>,
  meta: ReactTable.MetaBase<D>
) => {
  const instance = meta.instance as TableInstance<D>
  const state = rawState as TableState<D>
  const { filters } = instance
  return {
    ...state,
    filters: filters ?? EMPTY_FILTERS,
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
  if (!isEqual(prevState?.filters, state.filters)) {
    instance.onFiltersChange && instance.onFiltersChange(state.filters)
  }

  return state
}

const useControlledFilters = (hooks: ReactTable.Hooks<any>) => {
  hooks.stateReducers.push(reducer)
  hooks.useControlledState.push(useControlledState)
}

useControlledFilters.pluginName = 'useControlledFilters'

export default useControlledFilters
