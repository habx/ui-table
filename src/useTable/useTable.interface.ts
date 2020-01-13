import * as React from 'react'
import * as ReactTable from 'react-table'

export interface Column<D extends object = {}>
  extends ReactTable.Column<D>,
    ReactTable.UseFiltersColumnOptions<D> {
  HeaderIcon?: React.ReactNode
}

export interface TableOptions<D extends object = {}>
  extends Omit<ReactTable.TableOptions<D>, 'columns'> {
  columns: Array<Column<D>>
}
