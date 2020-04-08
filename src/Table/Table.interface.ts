import * as React from 'react'

import { Row, TableInstance } from '../types/Table'

export interface TableStyle {
  striped?: boolean
}

export interface TableProps<D extends object> {
  onRowClick?: (
    row: Row<D>,
    event: React.MouseEvent<HTMLTableRowElement>
  ) => void
  loading?: boolean
  noDataText?: React.ReactNode
  style?: TableStyle
  noDataComponent?: React.ComponentType
  instance: TableInstance<D>
}
