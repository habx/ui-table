import * as ReactTable from 'react-table'

import { IMEXColumn } from './imex.types'

const getImexColumns = <D extends object = {}>(columns: IMEXColumn<D>[]) => {
  const flatColumns = columns.flatMap(
    (column) =>
      ((column as ReactTable.ColumnGroup<D>)?.columns as IMEXColumn<D>[]) ?? [
        column,
      ]
  )
  const csvColumns = flatColumns.filter((column) => !!column.meta?.csv)

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
