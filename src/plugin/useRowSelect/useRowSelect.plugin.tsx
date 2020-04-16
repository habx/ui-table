import * as React from 'react'

import { Checkbox } from '@habx/ui-core'

import { CellProps, HeaderProps, Hooks } from '../../types/Table'

const rowSelectPlugin = <D extends object>(hooks: Hooks<D>) => {
  hooks.visibleColumns.push((columns) => [
    {
      id: 'selection',
      Header: ({ getToggleAllRowsSelectedProps }: HeaderProps<D>) => (
        <Checkbox {...getToggleAllRowsSelectedProps()} />
      ),
      Cell: ({ row }: CellProps<D>) => (
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
