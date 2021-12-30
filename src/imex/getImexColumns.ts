import * as ReactTable from 'react-table'

import { ColumnEnabledCondition } from '../types/Table'

import { IMEXColumn } from './imex.interface'

const COLUMN_ENABLED_CONDITION: ColumnEnabledCondition[] = [
  'always',
  'imex-only',
]

export const getImexColumns = <D extends { [key: string]: any } = any>(
  columns: IMEXColumn<D>[]
): IMEXColumn<D>[] => {
  const flatColumns = columns.flatMap(
    (column) =>
      ((column as ReactTable.ColumnGroup<D>)?.columns as IMEXColumn<D>[]) ?? [
        column,
      ]
  )
  const imexColumns = flatColumns.filter(
    (column) =>
      !!column?.imex &&
      COLUMN_ENABLED_CONDITION.includes(column.enabled ?? 'always')
  )

  imexColumns.forEach((column) => {
    if (typeof column.accessor !== 'string') {
      throw new Error('Cannot include data with a non-string accessor')
    }
    if (typeof column.Header !== 'string') {
      throw new Error('Cannot include non string Header')
    }
  })

  return imexColumns
}
