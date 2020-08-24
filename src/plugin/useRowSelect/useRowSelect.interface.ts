import * as ReactTable from 'react-table'

import { CheckboxProps } from '@habx/ui-core'

export interface UseRowSelectCellProps<D extends {}> {
  getCheckboxProps?: (row: ReactTable.Row<D>) => Partial<CheckboxProps>
}

export interface UseRowSelectOptions<D extends {}>
  extends ReactTable.UseRowSelectOptions<D>,
    UseRowSelectCellProps<D> {
  canSelectAll?: boolean
}

export interface UseRowSelectOptions<D extends {}>
  extends ReactTable.UseRowSelectOptions<D>,
    UseRowSelectCellProps<D> {
  canSelectAll?: boolean
}

export interface UseRowSelectInterfaceProps<D extends {}>
  extends UseRowSelectOptions<D> {}
