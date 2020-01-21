import * as React from 'react'
import * as ReactTable from 'react-table'

import {
  UseDensityInstanceProps,
  UseDensityOptions,
  UseDensityColumnProps,
  UseDensityState,
} from '../plugin/useDensity'

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
    ReactTable.UseSortByOptions<D>,
    UseDensityOptions<D> {
  columns: Array<Column<D>>
  initialState?: Partial<TableState<D>>
}

export interface TableState<D extends object>
  extends ReactTable.TableState<D>,
    ReactTable.UseFiltersState<D>,
    ReactTable.UsePaginationState<D>,
    ReactTable.UseSortByState<D>,
    UseDensityState<D> {}

export interface TableInstance<D extends object = {}>
  extends Omit<ReactTable.TableInstance<D>, 'state' | 'initialState'>,
    ReactTable.UseFiltersInstanceProps<D>,
    ReactTable.UsePaginationInstanceProps<D>,
    ReactTable.UseSortByInstanceProps<D>,
    UseDensityInstanceProps<D> {
  state: TableState<D>
  initialState: TableState<D>
}

export interface ColumnInstance<D extends object = {}>
  extends ReactTable.ColumnInstance<D>,
    ReactTable.UseFiltersColumnProps<D>,
    ReactTable.UseSortByColumnProps<D>,
    UseDensityColumnProps<D> {}
