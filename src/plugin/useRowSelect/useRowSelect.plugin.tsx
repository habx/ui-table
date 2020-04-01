import * as React from 'react'

import { Checkbox } from '@habx/ui-core'

import { Hooks } from '../../types/Table'

const rowSelectPlugin = <D extends object>(hooks: Hooks<D>) => {
  hooks.visibleColumns.push((columns) => [
    {
      id: 'selection',
      Header: ({ getToggleAllRowsSelectedProps }) => (
        <Checkbox {...getToggleAllRowsSelectedProps()} />
      ),
      Cell: ({ row }) => (
        <Checkbox
          {...(row.getToggleRowSelectedProps
            ? row.getToggleRowSelectedProps()
            : {})}
        />
      ),
    },
    ...columns,
  ])
}

export default rowSelectPlugin
