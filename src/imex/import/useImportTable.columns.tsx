import { get, isFunction, isNil } from 'lodash'
import * as React from 'react'
import * as ReactTable from 'react-table'

import { Tooltip } from '@habx/ui-core'

import { CellProps, FooterProps } from '../../types/Table'
import { IMEXColumn, ImportedRow } from '../imex.interface'

import { IconIndicator } from './DataIndicators'
import {
  ChangedCell,
  ErrorCellContent,
  ErrorIcon,
  NewCell,
  PrevCell,
} from './useImportTable.style'
import { softCompare } from './useImportTable.utils'

export const getCompareColumnsFromImexColumns = <D extends {}>(
  columns: IMEXColumn<ImportedRow<D>>[]
) => {
  const compareColumns = columns.map((column) => ({
    ...column,
    Footer: (({ column: fColumn, rows, data }) => {
      const accessor = (fColumn as IMEXColumn)
        .accessor as ReactTable.Accessor<D>
      const columnModified = rows.reduce(
        (sum, row) =>
          !Object.values(row.original._rowMeta.errors).length &&
          accessor(row.original, row.index, {
            subRows: [],
            depth: row.depth,
            data,
          }) !==
            accessor(row.original._rowMeta.prevVal as D, row.index, {
              subRows: [],
              depth: row.depth,
              data,
            })
            ? sum + 1
            : sum,
        0
      )
      return <React.Fragment>{columnModified} impact(s)</React.Fragment>
    }) as ReactTable.Renderer<FooterProps<ImportedRow<D>>>,
    Cell: ((rawProps) => {
      const props = (rawProps as unknown) as CellProps<D>
      const rowMeta = rawProps.row.original?._rowMeta

      const Cell = (isFunction(column.Cell)
        ? column.Cell
        : ({ cell }) => <div>{cell.value}</div>) as React.ComponentType<
        CellProps<D>
      >

      // Do not add style on grouped cell
      if (rawProps.row.isGrouped) {
        return <Cell {...props} />
      }

      const cellPrevVal = get(rowMeta?.prevVal, column.accessor as string)

      const CellContainer: React.FunctionComponent = ({ children }) => {
        if (!Object.values(rowMeta?.errors ?? {}).length) {
          return <React.Fragment>{children}</React.Fragment>
        }
        const error = rowMeta?.errors?.[column.accessor as string]

        return (
          <Tooltip small title={`${error}`} disabled={!error}>
            <ErrorCellContent data-error={!!error}>
              {error && <ErrorIcon icon="exclam-round" />}
              {`${props.cell?.value}`}
            </ErrorCellContent>
          </Tooltip>
        )
      }

      const cellPrevProps = {
        ...props,
        cell: {
          ...props.cell,
          value: cellPrevVal ?? '',
        },
      }
      // using lodash merge causes performance issues

      if (isNil(cellPrevVal)) {
        return (
          <CellContainer>
            <NewCell data-new-row={!!column.meta?.imex?.identifier}>
              <Cell {...props} />
            </NewCell>
          </CellContainer>
        )
      }

      if (
        isNil(props.cell.value) ||
        softCompare(cellPrevVal, props.cell.value)
      ) {
        return (
          <CellContainer>
            <Cell {...cellPrevProps} />
          </CellContainer>
        )
      }

      return (
        <CellContainer>
          <div>
            <ChangedCell>
              <Cell {...props} />
            </ChangedCell>
            <PrevCell>
              <Cell {...cellPrevProps} />
            </PrevCell>
          </div>
        </CellContainer>
      )
    }) as ReactTable.Renderer<CellProps<ImportedRow<D>>>,
  }))
  // Status column
  compareColumns.unshift({
    Header: '',
    maxWidth: 40,
    id: 'status',
    Footer: '',
    Cell: (({ row }) => {
      const rowMeta = row.original._rowMeta

      if (Object.values(rowMeta.errors).length) {
        return <IconIndicator type="ignored" />
      }
      if (!rowMeta.prevVal) {
        return <IconIndicator type="addition" />
      }
      return <IconIndicator type="edition" />
    }) as ReactTable.Renderer<CellProps<ImportedRow<D>>>,
  })
  return compareColumns
}
