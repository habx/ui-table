import * as React from 'react'
import * as ReactTable from 'react-table'

export interface TableProps<D extends object> {
  onRowClick?: (
    row: ReactTable.Row<D>,
    event: React.MouseEvent<HTMLTableRowElement>
  ) => void
  loading?: boolean
  noDataText?: React.ReactNode
}

export interface TableInstance<D extends object = {}>
  extends ReactTable.TableInstance<D>,
    ReactTable.UsePaginationInstanceProps<D>,
    ReactTable.UseSortByInstanceProps<D> {}

export interface ColumnInstance<D extends object = {}>
  extends ReactTable.ColumnInstance<D>,
    ReactTable.UseFiltersColumnProps<D>,
    ReactTable.UseSortByColumnProps<D> {}
