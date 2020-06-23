import * as React from 'react'

import { Checkbox, Tooltip } from '@habx/ui-core'

import { CellProps, HeaderProps, Hooks } from '../../types/Table'

import { CheckboxContainer } from './useRowSelect.style'

const useRowSelect = <D extends object>(hooks: Hooks<D>) => {
  hooks.visibleColumns.push((columns) => [
    {
      id: 'selection',
      Header: ({ getToggleAllRowsSelectedProps }: HeaderProps<D>) => (
        <Tooltip title="Tout sélectionner">
          <CheckboxContainer>
            <Checkbox {...getToggleAllRowsSelectedProps()} />
          </CheckboxContainer>
        </Tooltip>
      ),
      Cell: ({ row }: CellProps<D>) => (
        <CheckboxContainer>
          <Checkbox
            {...(row.getToggleRowSelectedProps
              ? row.getToggleRowSelectedProps()
              : {})}
          />
        </CheckboxContainer>
      ),
    },
    ...columns,
  ])
}

export default useRowSelect
