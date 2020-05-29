import * as React from 'react'

import { Row, TableInstance } from '../types/Table'

export interface TableStyle {
  striped?: boolean
  scrollable?: boolean
}

export interface TableProps<D extends object> {
  onRowClick?: (
    row: Row<D>,
    event: React.MouseEvent<HTMLTableRowElement>
  ) => void
  getRowCharacteristics?: (row: Row<D>) => Partial<RowCharacteristics>
  loading?: boolean
  noDataText?: React.ReactNode
  style?: TableStyle
  noDataComponent?: React.ComponentType
  instance: TableInstance<D>
  virtualized?: boolean
}

export type RowCharacteristics = {
  isActive: boolean
  isInteractive: boolean
}
