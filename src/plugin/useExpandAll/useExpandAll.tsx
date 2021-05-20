import * as React from 'react'
import * as ReactTable from 'react-table'
import { ensurePluginOrder } from 'react-table'

import { TableInstance } from '../../types/Table'

const useInstance = <D extends {}>(instance: TableInstance<D>) => {
  const { data, toggleAllRowsExpanded, plugins } = instance

  React.useLayoutEffect(() => {
    toggleAllRowsExpanded()
  }, [data]) // eslint-disable-line

  ensurePluginOrder(plugins, ['useExpanded'], 'useExpandAll')
}

export const useExpandAll = (hooks: ReactTable.Hooks<any>) => {
  hooks.useInstance.push(useInstance as any)
}

useExpandAll.pluginName = 'useExpandAll'
