import * as React from 'react'
import * as ReactTable from 'react-table'

import { TableInstance } from '../../types/Table'

const useInstance = <D extends {}>(instance: TableInstance<D>) => {
  const { expandAll, data, toggleRowExpanded, expandedRows } = instance

  React.useLayoutEffect(() => {
    if (expandAll) {
      expandedRows.map(({ id }) => {
        return toggleRowExpanded(id as any, true)
      })
    }
  }, [expandAll, data, toggleRowExpanded]) // eslint-disable-line
}

const useExpandAll = (hooks: ReactTable.Hooks<any>) => {
  hooks.useInstance.push(useInstance as any)
}

useExpandAll.pluginName = 'useExpandAll'

export default useExpandAll
