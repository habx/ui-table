import * as React from 'react'

import { Row, TableInstance } from '../types/Table'

export interface TableProps<D extends object> {
  onRowClick?: (
    row: Row<D>,
    event: React.MouseEvent<HTMLTableRowElement>
  ) => void
  getRowCharacteristics?: (row: Row<D>) => Partial<RowCharacteristics>
  renderRowSubComponent?: (row: Row<D>) => React.ReactNode
  loading?: boolean
  noDataText?: React.ReactNode
  noDataComponent?: React.ComponentType
  instance: TableInstance<D>
  virtualized?: boolean
}

export type RowCharacteristics = {
  isActive: boolean
  isInteractive: boolean
  backgroundColor: string
}
