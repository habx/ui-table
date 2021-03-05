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

  const {
    onFiltersChange,
    filters,
    shouldIgnoreEmptyFilter = true,
  } = rawInstance as TableInstance<D>
  const initialized = !(!prevState?.filters && filters)
  if (initialized && !isEqual(prevState?.filters, state.filters)) {
    let newFilters = state.filters
    if (shouldIgnoreEmptyFilter) {
      newFilters = state.filters.filter(({ value }) =>
        Array.isArray(value) ? !!value.length : !!value
      )
    }
    onFiltersChange?.(newFilters)
  }

  return state
}

export const useControlledFilters = (hooks: ReactTable.Hooks<any>) => {
  hooks.stateReducers.push(reducer)
  hooks.useControlledState.push(useControlledState)
}

useControlledFilters.pluginName = 'useControlledFilters'
