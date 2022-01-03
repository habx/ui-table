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
    if (
      typeof column.accessor !== 'string' &&
      typeof column.imex?.path !== 'string'
    ) {
      throw new Error(
        'Cannot include data without a column path or string accessor'
      )
    }
    if (
      typeof column.Header !== 'string' &&
      typeof column.imex?.header !== 'string'
    ) {
      throw new Error(
        'Cannot include data without column header or imex.header'
      )
    }
  })

  return imexColumns
}
