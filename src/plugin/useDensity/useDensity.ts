import * as React from 'react'
import * as ReactTable from 'react-table'

import { TableState, TableInstance } from '../../types/Table'

import { Densities, UseDensityInstanceProps } from './useDensity.interface'

ReactTable.actions.setDensity = 'setDensity'

const useInstance = <D extends {}>(
  rawInstance: ReactTable.TableInstance<D>
) => {
  const _instance = rawInstance as TableInstance<D>

  const { dispatch } = _instance

  const setDensity = React.useCallback(
    (density: Densities) =>
      dispatch({ type: ReactTable.actions.setDensity, density }),
    [dispatch]
  )

  const pluginInstance: UseDensityInstanceProps = {
    setDensity,
  }

  Object.assign(_instance, pluginInstance)
}

const reducer = <D extends {}>(
  rawState: ReactTable.TableState<D>,
  action: ReactTable.ActionType,
  _prevState?: ReactTable.TableState<D>,
  rawInstance?: ReactTable.TableInstance<D>
) => {
  const state = rawState as TableState<D>
  const instance = rawInstance as TableInstance<D>

  const getState = () => {
    switch (action.type) {
      case ReactTable.actions.init: {
        return {
          ...state,
          density: instance.initialState.density || 'medium',
        }
      }

      case ReactTable.actions.setDensity: {
        return {
          ...state,
          density: action.density,
        }
      }

      default: {
        return state
      }
    }
  }

  return getState() as ReactTable.TableState<D>
}

export const useDensity = (hooks: ReactTable.Hooks<any>) => {
  hooks.useInstance.push(useInstance)
  hooks.stateReducers.push(reducer)
}

useDensity.pluginName = 'useDensity'
