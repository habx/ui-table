import * as React from 'react'
import * as ReactTable from 'react-table'

import { TableProps } from '../getTableComponent'

export interface TableInstance<D extends object = {}>
  extends ReactTable.TableInstance<D> {
  TableComponent: React.FunctionComponent<TableProps<D>>
}

export interface Column<D extends object = {}> extends ReactTable.Column<D> {
  HeaderIcon?: React.ReactNode
}

export interface TableOptions<D extends object = {}>
  extends Omit<ReactTable.TableOptions<D>, 'columns'> {
  columns: Array<Column<D>>
}
