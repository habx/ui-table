import * as React from 'react'
import * as ReactTable from 'react-table'
import {
  ColumnGroup,
  ColumnWithLooseAccessor,
  ColumnWithStrictAccessor,
} from 'react-table'

import { CheckboxProps } from '@habx/ui-core'

import { IMEXColumn } from '../imex/imex.types'
import {
  UseControlledFiltersInstanceProps,
  UseControlledFiltersOptions,
} from '../plugin/useControlledFilters'
import {
  UseControlledPaginationInstanceProps,
  UseControlledPaginationOptions,
} from '../plugin/useControlledPagination'
import {
  UseControlledSortByInstanceProps,
  UseControlledSortByOptions,
} from '../plugin/useControlledSortBy'
import {
  UseDensityInstanceProps,
  UseDensityOptions,
  UseDensityColumnProps,
  UseDensityState,
} from '../plugin/useDensity'
import {
  UseInfiniteScrollInstanceProps,
  UseInfiniteScrollOptions,
} from '../plugin/useInfiniteScroll'
import {
  UseRowSelectCellProps,
  UseRowSelectInterfaceProps,
  UseRowSelectOptions,
} from '../plugin/useRowSelect/useRowSelect.interface'

export interface FilterProps<D extends object>
  extends Omit<ReactTable.FilterType<D>, 'column'> {
  column: ColumnInstance<D>
}

export interface CellProps<D extends object = {}, V = any>
  extends ReactTable.CellProps<D, V>,
    UseRowSelectCellProps<D> {
  row: Row<D>
}

export type HeaderProps<D extends object> = TableInstance<D> & {
  column: ColumnInstance<D>
  getToggleAllRowsSelectedProps?: () => object
}

export type FooterProps<D extends object> = TableInstance<D> & {
  column: ColumnInstance<D>
}

export type ColumnEnabledCondition = 'always' | 'never' | 'imex-only'

type CustomColumnFields<Meta = {}> = {
  align?: 'left' | 'right' | 'center'
  enabled?: ColumnEnabledCondition | null
  meta?: Meta & { [key: string]: any }
}

type ColumnCustom<D extends object, Meta = {}> = Omit<
  ReactTable.UseFiltersColumnOptions<D>,
  'Filter'
> &
  Partial<ReactTable.UseFiltersColumnProps<D>> &
  ReactTable.UseGroupByColumnOptions<D> &
  ReactTable.UseSortByColumnOptions<D> &
  CustomColumnFields<Meta> & {
    HeaderIcon?: React.ReactNode
    Filter?: ReactTable.Renderer<FilterProps<D>>
    Cell?: ReactTable.Renderer<CellProps<D>>
    Header?: ReactTable.Renderer<HeaderProps<D>>
    Footer?: ReactTable.Renderer<FooterProps<D>>
    columns?: Column<D, Meta>[]
    headerClassName?: string
  }

export type Column<D extends { [key: string]: any } = any, Meta = {}> =
  | (Omit<ColumnGroup<D>, 'columns'> & ColumnCustom<D, Meta>)
  | (ColumnWithLooseAccessor<D> & ColumnCustom<D, Meta>)
  | (ColumnWithStrictAccessor<D> & ColumnCustom<D, Meta>)

export interface TableOptions<D extends object = {}>
  extends Omit<
      ReactTable.TableOptions<D>,
      'columns' | 'initialState' | 'defaultColumn' | 'data'
    >,
    ReactTable.UseFiltersOptions<D>,
    ReactTable.UsePaginationOptions<D>,
    ReactTable.UseSortByOptions<D>,
    ReactTable.UseRowSelectOptions<D>,
    ReactTable.UseGroupByOptions<D>,
    ReactTable.UseExpandedOptions<D>,
    UseDensityOptions<D>,
    UseInfiniteScrollOptions<D>,
    UseControlledPaginationOptions<D>,
    UseControlledFiltersOptions<D>,
    UseControlledSortByOptions<D>,
    UseRowSelectOptions<D> {
  columns: Array<Column<D> | IMEXColumn<D>>
  defaultColumn?: Partial<Column<D>>
  initialState?: Partial<TableState<D>>
  data?: D[] | null
}

export interface TableState<D extends object>
  extends ReactTable.TableState<D>,
    ReactTable.UseFiltersState<D>,
    ReactTable.UsePaginationState<D>,
    ReactTable.UseSortByState<D>,
    ReactTable.UseRowSelectState<D>,
    ReactTable.UseGroupByState<D>,
    ReactTable.UseExpandedState<D>,
    UseDensityState<D> {
  groupBy: string[]
}

export interface TableInstance<D extends object = {}>
  extends Omit<
      ReactTable.TableInstance<D>,
      'state' | 'initialState' | 'columns'
    >,
    ReactTable.UseFiltersInstanceProps<D>,
    ReactTable.UsePaginationInstanceProps<D>,
    ReactTable.UseSortByInstanceProps<D>,
    ReactTable.UseRowSelectInstanceProps<D>,
    ReactTable.UseGroupByInstanceProps<D>,
    ReactTable.UseExpandedInstanceProps<D>,
    UseDensityInstanceProps<D>,
    UseDensityInstanceProps<D>,
    UseControlledPaginationInstanceProps<D>,
    UseControlledFiltersInstanceProps<D>,
    UseControlledSortByInstanceProps<D>,
    UseInfiniteScrollInstanceProps<D>,
    UseRowSelectInterfaceProps<D> {
  state: TableState<D>
  initialState: TableState<D>
  rows: Array<Row<D>>
  page: Array<Row<D>>
  columns: ColumnInstance<D>[]
}

export type ColumnInstance<
  D extends object = {}
> = ReactTable.ColumnInstance<D> &
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
  extends Omit<ReactTable.Row<D>, 'cells'>,
    ReactTable.UseExpandedRowProps<D>,
    ReactTable.UseRowSelectRowProps<D> {
  cells: Array<Cell<D>>
  subRows: Array<Row<D>>
  groupByVal?: string
  isGrouped?: boolean
  getCheckboxProps?: (row: ReactTable.Row<D>) => Partial<CheckboxProps>
}

export interface Hooks<D extends object>
  extends Omit<ReactTable.Hooks<D>, 'columns'> {
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
