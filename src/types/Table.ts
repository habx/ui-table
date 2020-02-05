import * as React from 'react'
import * as ReactTable from 'react-table'

import {
  UseDensityInstanceProps,
  UseDensityOptions,
  UseDensityColumnProps,
  UseDensityState,
} from '../plugin/useDensity'
import {
  UseExpandedInstanceProps,
  UseExpandedState,
} from '../plugin/useExpanded'

export interface FilterProps<D extends object>
  extends Omit<ReactTable.FilterType<D>, 'column'> {
  column: ColumnInstance<D>
}

export interface CellProps<D extends object = {}>
  extends ReactTable.CellProps<D> {
  row: Row<D>
}

export interface Column<D extends object = {}>
  extends ReactTable.Column<D>,
    ReactTable.UseFiltersColumnOptions<D>,
    ReactTable.UseGroupByColumnOptions<D>,
    ReactTable.UseSortByColumnOptions<D> {
  HeaderIcon?: React.ReactNode
  Filter?: ReactTable.Renderer<FilterProps<D>>
  Cell?: ReactTable.Renderer<CellProps<D>>
}

export interface TableOptions<D extends object = {}>
  extends Omit<ReactTable.TableOptions<D>, 'columns' | 'initialState'>,
    ReactTable.UseFiltersOptions<D>,
    ReactTable.UsePaginationOptions<D>,
    ReactTable.UseSortByOptions<D>,
    ReactTable.UseGroupByOptions<D>,
    UseDensityOptions<D> {
  columns: Array<Column<D>>
  initialState?: Partial<TableState<D>>
  expandAll?: boolean
}

export interface TableState<D extends object>
  extends ReactTable.TableState<D>,
    ReactTable.UseFiltersState<D>,
    ReactTable.UsePaginationState<D>,
    ReactTable.UseSortByState<D>,
    UseExpandedState<D>,
    UseDensityState<D> {
  groupBy: string[]
}

export interface TableInstance<D extends object = {}>
  extends Omit<ReactTable.TableInstance<D>, 'state' | 'initialState'>,
    ReactTable.UseFiltersInstanceProps<D>,
    ReactTable.UsePaginationInstanceProps<D>,
    ReactTable.UseSortByInstanceProps<D>,
    ReactTable.UseGroupByInstanceProps<D>,
    UseExpandedInstanceProps<D>,
    UseDensityInstanceProps<D> {
  state: TableState<D>
  initialState: TableState<D>
  rows: Array<Row<D>>
  page: Array<Row<D>>
  expandAll?: boolean
}

export interface ColumnInstance<D extends object = {}>
  extends ReactTable.ColumnInstance<D>,
    ReactTable.UseFiltersColumnProps<D>,
    ReactTable.UseSortByColumnProps<D>,
    ReactTable.UseGroupByColumnProps<D>,
    UseDensityColumnProps<D> {}

export interface Cell<D extends object = {}> extends ReactTable.Cell<D> {
  canGroupBy?: boolean
  isGrouped?: boolean
  groupedIndex?: number
  toggleGroupBy?: () => void
  isAggregated?: boolean
  isRepeatedValue?: boolean
}

export interface Row<D extends object = {}>
  extends Omit<ReactTable.Row<D>, 'cells'> {
  getExpandedToggleProps?: () => object
  cells: Array<Cell<D>>
  isExpanded?: boolean
  toggleExpanded: (isExpanded?: boolean) => void
  canExpand?: boolean
  subRows: Array<Row<D>>
  groupByVal?: string
  isGrouped?: boolean
}
