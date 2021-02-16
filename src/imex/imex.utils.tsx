import type * as Excel from 'exceljs'
import { get, isFunction, isNil, reduce } from 'lodash'
import * as React from 'react'
import * as ReactTable from 'react-table'

import { Icon, Tooltip } from '@habx/ui-core'

import { CellProps } from '../types/Table'

import {
  applyValidationRulesAndStyle,
  ExcelValidationOptions,
} from './excel.utils'
import { createWorkbook } from './exceljs'
import { ImportedRow } from './imex.interface'
import {
  ChangedCell,
  ErrorCellContent,
  ErrorIcon,
  NewCell,
  PrevCell,
} from './imex.style'
import { IMEXColumn, RowValueTypes } from './imex.types'

export const softCompare = (a: any, b: any): boolean =>
  typeof a !== 'object'
    ? a === b
    : reduce(
        a,
        (ctx: boolean, value, key) => {
          if (Array.isArray(value)) {
            return (
              value?.length === get(b, key, [])?.length &&
              value.reduce(
                (arrayCtx, v) => arrayCtx && get(b, key, []).includes(v),
                true
              ) &&
              ctx
            )
          }
          if (typeof value === 'object') {
            return softCompare(value, get(b, key)) && ctx
          }
          return `${value}` === `${get(b, key)}` && ctx
        },
        true
      )

export const saveFile = (filename: string, file: any) => {
  const blob = new Blob([file], { type: 'text/csv;charset=utf-8;' })
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename)
  } else {
    const link = document.createElement('a')
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}

interface ExportDataOptions extends ExcelValidationOptions {
  type: 'csv' | 'xls'
  /**
   *
   * @param workbook to export
   * Allow to edit workbook instance before saving
   */
  editWorkbookBeforeSave?: (workbook: Excel.Workbook) => void | Promise<void>
}
export const exportData = async <D extends {}>(
  filename: string,
  columns: IMEXColumn<D>[],
  data: any[][],
  options: ExportDataOptions
) => {
  const workbook = await createWorkbook()
  const worksheet = workbook.addWorksheet(filename)

  /**
   * Insert data
   */
  worksheet.columns = columns.map((column) => ({
    header: column.Header,
    key: column.id ?? column.Header,
    width: column.meta?.imex?.width,
    hidden: column.meta?.imex?.hidden,
  })) as Excel.Column[]

  worksheet.addRows(data)

  await options.editWorkbookBeforeSave?.(workbook)

  if (options.type === 'xls') {
    applyValidationRulesAndStyle<D>(worksheet, columns, options)
    const fileBuffer = await workbook.xlsx.writeBuffer()
    saveFile(`${filename}.xlsx`, fileBuffer)
  } else {
    const fileBuffer = await workbook.csv.writeBuffer()
    saveFile(`${filename}.csv`, fileBuffer)
  }
}

export enum ParseCellError {
  NOT_A_NUMBER,
  INVALID,
}
export const ParsingErrors: Record<ParseCellError, string> = {
  [ParseCellError.NOT_A_NUMBER]: 'nombre invalide',
  [ParseCellError.INVALID]: 'invalide',
}
export const parseCell = (
  rawCell: any,
  type: RowValueTypes,
  options: { format: (value: any) => any }
): string | number | string[] | number[] => {
  switch (type) {
    case 'number':
      if (typeof rawCell === 'number') {
        return Number(options.format(rawCell))
      }
      const newCellValue = Number(options.format(rawCell.replace(',', '.')))
      if (Number.isNaN(newCellValue)) {
        throw new Error(ParsingErrors[ParseCellError.NOT_A_NUMBER])
      }
      return newCellValue
    case 'number[]':
      return options
        .format(rawCell)
        .split(',')
        .map((value: string | number) => {
          const transformedValue = Number(value)
          if (Number.isNaN(transformedValue)) {
            throw new Error(ParsingErrors[ParseCellError.NOT_A_NUMBER])
          }
          return transformedValue
        })
    case 'string[]':
      return options.format(rawCell).split(',')
    default:
      return options.format(rawCell)
  }
}

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
            title={error as string}
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
