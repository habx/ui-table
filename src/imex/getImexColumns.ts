import * as ReactTable from 'react-table'

import { ColumnEnabledCondition } from '../types/Table'

import { IMEXColumn } from './imex.types'

const COLUMN_ENABLED_CONDITION: ColumnEnabledCondition[] = [
  'always',
  'imex-only',
]

const getImexColumns = <D extends { [key: string]: any } = any>(
  columns: IMEXColumn<D>[]
) => {
  const flatColumns = columns.flatMap(
    (column) =>
      ((column as ReactTable.ColumnGroup<D>)?.columns as IMEXColumn<D>[]) ?? [
        column,
      ]
  )
  const csvColumns = flatColumns.filter(
    (column) =>
      !!column.meta?.csv &&
      COLUMN_ENABLED_CONDITION.includes(column.enabled ?? 'always')
  )

  csvColumns.forEach((column) => {
    if (typeof column.accessor !== 'string') {
      throw new Error('Cannot include data with a non-string accessor')
    }
    if (typeof column.Header !== 'string') {
      throw new Error('Cannot include non string Header')
    }
  })

  return csvColumns
}
export default getImexColumns
