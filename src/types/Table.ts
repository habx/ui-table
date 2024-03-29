import * as React from 'react'
import * as ReactTable from 'react-table'
import {
  ColumnGroup,
  ColumnWithLooseAccessor,
  ColumnWithStrictAccessor,
} from 'react-table'

import { CheckboxProps } from '@habx/ui-core'

import { IMEXColumn } from '../imex/imex.interface'
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

type CustomColumnFields = {
  /** @default 'left' */
  align?: 'left' | 'right' | 'center'
  /** @default 'always' */
  enabled?: ColumnEnabledCondition | null
}

type ColumnCustom<D extends object> = Omit<
  ReactTable.UseFiltersColumnOptions<D>,
  'Filter'
> &
  Partial<ReactTable.UseFiltersColumnProps<D>> &
  ReactTable.UseGroupByColumnOptions<D> &
  ReactTable.UseGlobalFiltersColumnOptions<D> &
  ReactTable.UseSortByColumnOptions<D> &
  CustomColumnFields & {
    HeaderIcon?: React.ReactNode
    Filter?: ReactTable.Renderer<FilterProps<D>>
    Cell?: ReactTable.Renderer<CellProps<D>>
    Header?: ReactTable.Renderer<HeaderProps<D>>
    Footer?: ReactTable.Renderer<FooterProps<D>>
    columns?: Column<D>[]
    headerClassName?: string
  }

export type Column<D extends object = any> =
  | (Omit<ColumnGroup<D>, 'columns'> & ColumnCustom<D>)
  | (ColumnWithLooseAccessor<D> & ColumnCustom<D>)
  | (ColumnWithStrictAccessor<D> & ColumnCustom<D>)

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
    ReactTable.UseGlobalFiltersOptions<D>,
    UseDensityOptions,
    UseInfiniteScrollOptions,
    UseControlledPaginationOptions,
    UseControlledFiltersOptions,
    UseControlledSortByOptions<D>,
    UseRowSelectOptions<D> {
  columns: Array<Column<D> | IMEXColumn<D>>
  defaultColumn?: Partial<Column<D>>
  initialState?: Partial<TableState<D>>
  data: D[] | null | undefined
}

export interface TableState<D extends object>
  extends ReactTable.TableState<D>,
    ReactTable.UseFiltersState<D>,
    ReactTable.UsePaginationState<D>,
    ReactTable.UseSortByState<D>,
    ReactTable.UseRowSelectState<D>,
    ReactTable.UseGroupByState<D>,
    ReactTable.UseGlobalFiltersState<D>,
    ReactTable.UseExpandedState<D>,
    UseDensityState {
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
    ReactTable.UseGlobalFiltersInstanceProps<D>,
    UseDensityInstanceProps,
    UseDensityInstanceProps,
    UseControlledPaginationInstanceProps,
    UseControlledFiltersInstanceProps,
    UseControlledSortByInstanceProps<D>,
    UseInfiniteScrollInstanceProps,
    UseRowSelectInterfaceProps<D> {
  state: TableState<D>
  initialState: TableState<D>
  rows: Array<Row<D>>
  page: Array<Row<D>>
  columns: ColumnInstance<D>[]
}

export type ColumnInstance<D extends object = {}> =
  ReactTable.ColumnInstance<D> &
    ReactTable.UseTableColumnProps<D> &
    ReactTable.UseFiltersColumnProps<D> &
    ReactTable.UseSortByColumnProps<D> &
    ReactTable.UseGroupByColumnProps<D> &
    UseDensityColumnProps & {
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
