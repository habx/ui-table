import * as React from 'react'

import { Checkbox, Tooltip } from '@habx/ui-core'

import { CellProps, HeaderProps, Hooks, TableInstance } from '../../types/Table'

import { CheckboxContainer } from './useRowSelect.style'

export const useRowSelect = <D extends object>(hooks: Hooks<D>) => {
  hooks.visibleColumns.push((columns, { instance: _instance }) => {
    const instance = _instance as TableInstance<D>
    return [
      {
        id: 'selection',
        Header: ({ getToggleAllRowsSelectedProps }: HeaderProps<D>) =>
          instance.canSelectAll === false ? null : (
            <Tooltip title="Tout sélectionner">
              <CheckboxContainer onClick={(e) => e.stopPropagation()}>
                <Checkbox {...getToggleAllRowsSelectedProps()} />
              </CheckboxContainer>
            </Tooltip>
          ),
        Cell: ({ row, getCheckboxProps = () => ({}) }: CellProps<D>) => {
          return (
            <CheckboxContainer onClick={(e) => e.stopPropagation()}>
              <Checkbox
                {...(row.getToggleRowSelectedProps
                  ? row.getToggleRowSelectedProps()
                  : {})}
                {...getCheckboxProps(row)}
              />
            </CheckboxContainer>
          )
        },
      },
      ...columns,
    ]
  })
}
