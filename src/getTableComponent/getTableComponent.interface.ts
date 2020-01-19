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

export interface TableState<D extends object> extends ReactTable.TableState<D> {
  pageIndex: number
  pageSize: number
  filters: ReactTable.Filters<D>
}

export interface TableInstance<D extends object = {}>
  extends Omit<ReactTable.TableInstance<D>, 'state'>,
    ReactTable.UseFiltersInstanceProps<D>,
    ReactTable.UsePaginationInstanceProps<D>,
    ReactTable.UseSortByInstanceProps<D> {
  state: TableState<D>
}

export interface ColumnInstance<D extends object = {}>
  extends ReactTable.ColumnInstance<D>,
    ReactTable.UseFiltersColumnProps<D>,
    ReactTable.UseSortByColumnProps<D> {}
