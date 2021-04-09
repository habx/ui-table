import { isEqual } from 'lodash'
import * as ReactTable from 'react-table'

import { TableInstance, TableState } from '../../types/Table'

const EMPTY_SORT_BY: any[] = []

const useControlledState = <D extends {}>(
  rawState: ReactTable.TableState<D>,
  meta: ReactTable.MetaBase<D>
) => {
  const instance = meta.instance as TableInstance<D>
  const state = rawState as TableState<D>
  const { sortBy } = instance
  return {
    ...state,
    sortBy: sortBy ?? EMPTY_SORT_BY,
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
  const initialized = !(!prevState?.sortBy && instance.sortBy)
  if (initialized && !isEqual(prevState?.sortBy, state.sortBy)) {
    instance?.onSortByChange?.(state.sortBy)
  }

  return state
}

export const useControlledSortBy = (hooks: ReactTable.Hooks<any>) => {
  hooks.stateReducers.push(reducer)
  hooks.useControlledState.push(useControlledState)
}

useControlledSortBy.pluginName = 'useControlledFilters'
