import * as React from 'react'
import * as ReactTable from 'react-table'

export interface TableStyle {
  striped?: boolean
}

export interface TableProps<D extends object> {
  onRowClick?: (
    row: ReactTable.Row<D>,
    event: React.MouseEvent<HTMLTableRowElement>
  ) => void
  loading?: boolean
  noDataText?: React.ReactNode
  style?: TableStyle
}
