import { get, isFunction, isNil } from 'lodash'
import * as React from 'react'
import * as ReactTable from 'react-table'

import { Tooltip } from '@habx/ui-core'

import { CellProps, Column, FooterProps } from '../../types/Table'
import { IMEXColumn, ImportedRow } from '../imex.interface'
import { getPath } from '../imex.utils'

import { IconIndicator } from './DataIndicators'
import {
  ChangedCell,
  ErrorCellContent,
  ErrorIcon,
  NewCell,
  PrevCell,
} from './useImportTable.style'
import { softCompare } from './useImportTable.utils'

interface GetCompareColumnsFromImexColumnsOptions {
  /**
   * @default true
   */
  footer?: boolean
  /**
   * @default true
   */
  statusColumn?: boolean
}

export const getCompareColumnsFromImexColumns = <D extends ImportedRow<{}>>(
  columns: IMEXColumn<D>[],
  options?: GetCompareColumnsFromImexColumnsOptions
) => {
  const { footer = true, statusColumn = true } = options ?? {}

  // FIXME

  // @ts-ignore
  const compareColumns: Column<D>[] = columns
    .filter((column) => !column.imex?.hidden)
    .map((column) => ({
      ...column,
      Footer: footer
        ? ((({ column: fColumn, rows, data: rawData }) => {
            const data = [...rawData]
            const accessor = (fColumn as IMEXColumn)
              .accessor as ReactTable.Accessor<D>
            const columnModified = rows.reduce(
              (sum, row) =>
                row.original &&
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
          }) as ReactTable.Renderer<FooterProps<ImportedRow<D>>>)
        : undefined,
      Cell: ((rawProps) => {
        const props = rawProps as unknown as CellProps<D>
        const rowMeta = rawProps.row.original?._rowMeta

        const Cell = (
          isFunction(column.Cell)
            ? column.Cell
            : ({ cell }) => <div>{cell.value}</div>
        ) as React.ComponentType<CellProps<D>>

        // Do not add style on grouped cell
        if (rawProps.row.isGrouped) {
          return <Cell {...props} />
        }

        const cellPrevVal = get(rowMeta?.prevVal, getPath(column))

        const CellContainer: React.FunctionComponent = ({ children }) => {
          if (!Object.values(rowMeta?.errors ?? {}).length) {
            return <React.Fragment>{children}</React.Fragment>
          }
          const error = get(rowMeta!.errors, getPath(column))

          return (
            <Tooltip small title={`${error}`} disabled={!error}>
              <ErrorCellContent data-error={!!error}>
                {error && <ErrorIcon icon="exclam-round" />}
                {props.cell?.value ? `${props.cell?.value}` : ''}
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
              <NewCell data-new-row={!!column?.imex?.identifier}>
                <Cell {...props} />
              </NewCell>
            </CellContainer>
          )
        }

        if (softCompare(cellPrevVal, props.cell.value)) {
          return (
            <CellContainer>
              <Cell {...cellPrevProps} />
            </CellContainer>
          )
        }

        if (isNil(props.cell.value)) {
          return (
            <CellContainer>
              <PrevCell>
                <Cell {...cellPrevProps} />
              </PrevCell>
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

  if (statusColumn) {
    // Status column
    compareColumns.push({
      Header: '',
      maxWidth: 60,
      id: 'status',
      Footer: '',
      Cell: (({ row }) => {
        if (!row.original) {
          return null
        }
        const rowMeta = row.original._rowMeta

        if (Object.values(rowMeta.errors).length) {
          return <IconIndicator type="ignored" />
        }
        if (!rowMeta.prevVal) {
          return <IconIndicator type="addition" />
        }
        return <IconIndicator type="edition" />
      }) as ReactTable.Renderer<CellProps<D>>,
    })
  }

  return compareColumns
}
