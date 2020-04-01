import * as React from 'react'

import { Checkbox } from '@habx/ui-core'

import { Hooks } from '../..'

const rowSelectPlugin = (hooks: Hooks<any>) => {
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
