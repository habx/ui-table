import * as React from 'react'

import { Row } from '../types/Table'

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
}
