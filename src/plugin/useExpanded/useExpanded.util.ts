import { orderBy } from 'lodash'

import { Row, TableInstance } from '../../types/Table'

import {
  UseExpandedInstanceProps,
  UseExpandedState,
} from './useExpanded.interface'
export const expandRows = <D extends { [key: string]: boolean }>(
  rows: Row<D>[],
  {
    manualExpandedKey,
    expanded,
    expandSubRows = true,
  }: Partial<UseExpandedInstanceProps<D>> &
    UseExpandedState<D> &
    Partial<TableInstance<D>>
) => {
  const expandedRows: Row<D>[] = []

  const handleRow = (row: Row<D>) => {
    row.isExpanded =
      (row.original && row.original[manualExpandedKey as string]) ||
      expanded[row.id]

    row.canExpand = row.subRows && !!row.subRows.length

    expandedRows.push(row)

    if (expandSubRows && row.subRows && row.subRows.length && row.isExpanded) {
      row.subRows.forEach(handleRow)
    }
  }

  orderBy(rows, 'groupByVal').forEach(handleRow)

  return expandedRows
}
