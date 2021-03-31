import { get, isFunction, isNil } from 'lodash'
import * as React from 'react'
import * as ReactTable from 'react-table'

import { Icon, Tooltip } from '@habx/ui-core'

import { CellProps } from '../../types/Table'
import { IMEXColumn, ImportedRow } from '../imex.interface'

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
) =>
  columns.map((column) => ({
    ...column,
    Cell: ((rawProps) => {
      const props = (rawProps as unknown) as CellProps<D>
      const rowMeta = rawProps.row.original?._rowMeta

      const Cell = (isFunction(column.Cell)
        ? column.Cell
        : ({ cell }) => <div>{cell.value}</div>) as React.ComponentType<
        CellProps<D>
      >
      const cellPrevVal = get(rowMeta?.prevVal, column.accessor as string)

      const CellContainer: React.FunctionComponent = ({ children }) => {
        if (!Object.values(rowMeta?.errors ?? {}).length) {
          return <React.Fragment>{children}</React.Fragment>
        }
        const error = rowMeta?.errors?.[column.accessor as string]

        return (
          <Tooltip
            small
            title={`${error}:`}
            description={`${props.cell?.value}`}
            disabled={!error}
          >
            <ErrorCellContent>
              {error && <ErrorIcon icon="exclam-round" />}
              {children}
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
              {column.meta?.imex?.identifier && <Icon icon="add-round" />}
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
