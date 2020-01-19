import * as React from 'react'
import * as ReactTable from 'react-table'

import { ColumnInstance } from '../getTableComponent'
import { TableState } from '../getTableComponent/getTableComponent.interface'

export interface FilterProps<D extends object>
  extends Omit<ReactTable.FilterType<D>, 'column'> {
  column: ColumnInstance<D>
}

export interface Column<D extends object = {}>
  extends ReactTable.Column<D>,
    ReactTable.UseFiltersColumnOptions<D>,
    ReactTable.UseSortByColumnOptions<D> {
  HeaderIcon?: React.ReactNode
  Filter?: ReactTable.Renderer<FilterProps<D>>
}

export interface TableOptions<D extends object = {}>
  extends Omit<ReactTable.TableOptions<D>, 'columns' | 'initialState'>,
    ReactTable.UseFiltersOptions<D>,
    ReactTable.UsePaginationOptions<D>,
    ReactTable.UseSortByOptions<D> {
  columns: Array<Column<D>>
  initialState?: Partial<TableState<D>>
}
