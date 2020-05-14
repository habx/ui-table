import * as React from 'react'
import * as ReactTable from 'react-table'

import {
  UseControlledFiltersInstanceProps,
  UseControlledFiltersOptions,
} from '../plugin/useControlledFilters/useControlledFilters.interface'
import {
  UseControlledPaginationInstanceProps,
  UseControlledPaginationOptions,
} from '../plugin/useControlledPagination/useControlledPagination.interface'
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

export type HeaderProps<D extends object> = TableInstance<D> & {
  column: ColumnInstance<D>
  getToggleAllRowsSelectedProps?: () => object
}

type CustomColumnFields<Meta = {}> = {
  align?: 'left' | 'right' | 'center'
  meta?: Meta & { [key: string]: any }
}

export type Column<
  D extends { [key: string]: any } = any,
  Meta = {}
> = ReactTable.Column<D> &
  ReactTable.UseFiltersColumnOptions<D> &
  Partial<ReactTable.UseFiltersColumnProps<D>> &
  ReactTable.UseGroupByColumnOptions<D> &
  ReactTable.UseSortByColumnOptions<D> & {
    HeaderIcon?: React.ReactNode
    Filter?: ReactTable.Renderer<FilterProps<D>>
    Cell?: ReactTable.Renderer<CellProps<D>>
    Header?: ReactTable.Renderer<HeaderProps<D>>
  } & CustomColumnFields<Meta>

export interface TableOptions<D extends object = {}>
  extends Omit<ReactTable.TableOptions<D>, 'columns' | 'initialState'>,
    ReactTable.UseFiltersOptions<D>,
    ReactTable.UsePaginationOptions<D>,
    ReactTable.UseSortByOptions<D>,
    ReactTable.UseGroupByOptions<D>,
    UseDensityOptions<D>,
    UseControlledPaginationOptions<D>,
    UseControlledFiltersOptions<D> {
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
    ReactTable.UseRowSelectInstanceProps<D>,
    ReactTable.UseGroupByInstanceProps<D>,
    UseExpandedInstanceProps<D>,
    UseDensityInstanceProps<D>,
    UseControlledPaginationInstanceProps<D>,
    UseControlledFiltersInstanceProps<D> {
  state: TableState<D>
  initialState: TableState<D>
  rows: Array<Row<D>>
  page: Array<Row<D>>
  expandAll?: boolean
}

export type ColumnInstance<D extends object = {}> = ReactTable.ColumnInstance<
  D
> &
  ReactTable.UseTableColumnProps<D> &
  ReactTable.UseFiltersColumnProps<D> &
  ReactTable.UseSortByColumnProps<D> &
  ReactTable.UseGroupByColumnProps<D> &
  UseDensityColumnProps<D> & {
    getToggleAllRowsSelectedProps: Function
  } & CustomColumnFields

export interface Cell<D extends object = {}> extends ReactTable.Cell<D> {
  canGroupBy?: boolean
  isGrouped?: boolean
  groupedIndex?: number
  toggleGroupBy?: () => void
  isAggregated?: boolean
  isPlaceholder?: boolean
  row: Row<D>
}

export interface Row<D extends object = {}>
  extends Omit<ReactTable.Row<D>, 'cells'> {
  getToggleRowExpandedProps?: () => object
  cells: Array<Cell<D>>
  isExpanded?: boolean
  toggleExpanded: (isExpanded?: boolean) => void
  canExpand?: boolean
  subRows: Array<Row<D>>
  groupByVal?: string
  isGrouped?: boolean
  getToggleRowSelectedProps?: Function
}

export interface Hooks<D extends object> extends ReactTable.Hooks<D> {
  columns: Array<
    (columns: Array<Column<D>>, meta: ReactTable.Meta<D>) => Array<Column<D>>
  >
  columnsDeps: Array<(deps: any[], meta: ReactTable.Meta<D>) => any[]>
  allColumns: Array<
    (allColumns: Array<Column<D>>, meta: ReactTable.Meta<D>) => Array<Column<D>>
  >
  allColumnsDeps: Array<(deps: any[], meta: ReactTable.Meta<D>) => any[]>
  visibleColumns: Array<
    (allColumns: Array<Column<D>>, meta: ReactTable.Meta<D>) => Array<Column<D>>
  >
  visibleColumnsDeps: Array<
    (deps: any[], meta: ReactTable.Meta<D>) => Array<Column<D>>
  >
}
