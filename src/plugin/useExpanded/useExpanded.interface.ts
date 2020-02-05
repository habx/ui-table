import * as ReactTable from 'react-table'

export interface UseExpandedOptions<D extends {}> {}

export interface UseExpandedInstanceProps<D extends {}>
  extends ReactTable.UseExpandedInstanceProps<D> {
  manualExpandedKey: string
  paginateExpandedRows: boolean
  expandSubRows: boolean
  autoResetExpanded: boolean
}

export interface UseExpandedColumnProps<D extends {}> {}

export interface UseExpandedState<D extends {}>
  extends ReactTable.UseExpandedState<D> {}
