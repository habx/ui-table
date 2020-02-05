import * as React from 'react'
import {
  actions,
  functionalUpdate,
  makePropGetter,
  default as ReactTable,
  useConsumeHookGetter,
  useGetLatest,
  useMountedLayoutEffect,
  IdType,
} from 'react-table'

import { TableInstance, TableState } from '../..'
import { Row } from '../../types/Table'

import { expandRows } from './useExpanded.util'

// Actions
actions.toggleExpanded = 'toggleExpanded'
actions.toggleAllExpanded = 'toggleAllExpanded'
actions.setExpanded = 'setExpanded'
actions.resetExpanded = 'resetExpanded'

export const useExpanded = (hooks: ReactTable.Hooks<any>) => {
  hooks.getExpandedToggleProps = [defaultGetExpandedToggleProps]
  hooks.stateReducers.push(reducer)
  hooks.useInstance.push(useInstance)
}

useExpanded.pluginName = 'useExpanded'

const defaultGetExpandedToggleProps = <D extends object>(
  props: any,
  { row }: { row: Row<D> }
) => [
  props,
  {
    onClick: (e: React.MouseEvent) => {
      e.persist()
      row.toggleExpanded()
    },
    style: {
      cursor: 'pointer',
    },
    title: 'Toggle Expanded',
  },
]

// Reducer
const reducer = <D extends {}>(
  rawState: ReactTable.TableState<D>,
  action: ReactTable.ActionType,
  _prevState?: ReactTable.TableState<D>,
  rawInstance?: ReactTable.TableInstance<D>
) => {
  const state = rawState as TableState<D>
  const instance = rawInstance as TableInstance<D>
  if (action.type === actions.init) {
    return {
      expanded: {},
      ...state,
    }
  }

  if (action.type === actions.resetExpanded) {
    return {
      ...state,
      expanded: instance.initialState.expanded || {},
    }
  }

  if (action.type === actions.setExpanded) {
    return {
      ...state,
      expanded: functionalUpdate(action.expanded, state.expanded),
    }
  }

  if (action.type === actions.toggleExpanded) {
    const { id, expanded: setExpanded } = action
    const exists = state.expanded[id]

    const shouldExist =
      typeof setExpanded !== 'undefined' ? setExpanded : !exists

    if (!exists && shouldExist) {
      return {
        ...state,
        expanded: {
          ...state.expanded,
          [id]: true,
        },
      }
    } else if (exists && !shouldExist) {
      const { [id]: _, ...rest } = state.expanded
      return {
        ...state,
        expanded: rest,
      }
    } else {
      return state
    }
  }
}

const useInstance = <D extends {}>(
  rawInstance: ReactTable.TableInstance<D>
) => {
  const instance = rawInstance as TableInstance<D>
  const {
    data,
    rows,
    manualExpandedKey = 'expanded',
    paginateExpandedRows = true,
    expandSubRows = true,
    hooks,
    autoResetExpanded = true,
    state: { expanded },
    dispatch,
    expandAll,
  } = instance

  const getAutoResetExpanded = useGetLatest(autoResetExpanded)

  // Bypass any effects from firing when this changes
  useMountedLayoutEffect(() => {
    if (getAutoResetExpanded()) {
      dispatch({ type: actions.resetExpanded })
    }
  }, [dispatch, data])

  const toggleExpanded = React.useCallback(
    (id: string, expanded: boolean) => {
      dispatch({ type: actions.toggleExpanded, id, expanded })
    },
    [dispatch]
  )

  // use reference to avoid memory leak in #1608
  const getInstance = useGetLatest(instance)

  const getExpandedTogglePropsHooks = useConsumeHookGetter(
    getInstance().hooks,
    'getExpandedToggleProps'
  )

  hooks.prepareRow.push(rawRow => {
    const row = (rawRow as unknown) as Row<D>
    row.toggleExpanded = (set?: boolean) =>
      instance.toggleExpanded(
        (row.id as unknown) as IdType<D>[],
        set as boolean
      )

    row.getExpandedToggleProps = makePropGetter(getExpandedTogglePropsHooks(), {
      instance: getInstance(),
      row,
    })
  })

  const expandedRows = React.useMemo(() => {
    if (paginateExpandedRows) {
      return expandRows(rows, { manualExpandedKey, expanded, expandSubRows })
    }

    return rows
  }, [paginateExpandedRows, rows, manualExpandedKey, expanded, expandSubRows])

  const expandedDepth = React.useMemo(() => findExpandedDepth<D>(expanded), [
    expanded,
  ])

  React.useLayoutEffect(() => {
    if (expandAll) {
      expandedRows.map(({ id }) => {
        return toggleExpanded(id, true)
      })
    }
  }, [expandAll, data, toggleExpanded]) // eslint-disable-line

  Object.assign(instance, {
    preExpandedRows: rows,
    expandedRows,
    rows: expandedRows,
    toggleExpanded,
    expandedDepth,
  })
}

const findExpandedDepth = <D extends object>(
  expanded: Record<ReactTable.IdType<D>, boolean>
) => {
  let maxDepth = 0

  Object.keys(expanded).forEach(id => {
    const splitId = id.split('.')
    maxDepth = Math.max(maxDepth, splitId.length)
  })

  return maxDepth
}

export default useExpanded
