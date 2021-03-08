import type * as Excel from 'exceljs'

import { palette } from '@habx/ui-core'

import { createWorkbook, getCellValueTypes } from './exceljs'
import { IMEXColumn } from './imex.interface'

export const parseExcelFileData = async (file: File): Promise<any[][]> => {
  const CellValueType = getCellValueTypes()

  const arrayBuffer = await file.arrayBuffer()
  const workbook = await createWorkbook().xlsx.load(arrayBuffer)
  const worksheet = workbook.worksheets[0]

  const data: any[][] = []

  worksheet.eachRow((row, _rowIndex) => {
    // Indexes start at 1
    const rowIndex = _rowIndex - 1
    // fill with null to avoid empty content
    data[rowIndex] = new Array(worksheet.columns.length).fill(undefined)
    row.eachCell((cell, _cellIndex) => {
      // Indexes start at 1
      const cellIndex = _cellIndex - 1
      switch (cell.type) {
        case CellValueType.String:
        case CellValueType.Boolean:
        case CellValueType.Number:
        case CellValueType.Date:
          data[rowIndex][cellIndex] = cell.value ?? null
          break
        case CellValueType.Error:
        case CellValueType.Null:
        case CellValueType.Merge:
        case CellValueType.SharedString:
          data[rowIndex][cellIndex] = null
          break
        case CellValueType.Formula:
          data[rowIndex][cellIndex] =
            (cell.value as Excel.CellFormulaValue).result ?? null
          break
        case CellValueType.Hyperlink:
          // seems to be badly typed
          const text = ((cell.value as Excel.CellHyperlinkValue)
            .text as unknown) as Excel.CellRichTextValue
          data[rowIndex][cellIndex] =
            text?.richText?.map((t) => t.text).join('') ?? text ?? null
          break
        case CellValueType.RichText:
          data[rowIndex][cellIndex] =
            (cell.value as Excel.CellRichTextValue).richText
              ?.map((t) => t.text)
              .join('') ?? null
          break
        default:
          data[rowIndex][cellIndex] = null
          break
      }
    })
  })
  return data
}

export interface ExcelValidationOptions {
  /**
   * @default 50
   */
  extraRows?: number
}

export const applyValidationRulesAndStyle = <D extends {}>(
  worksheet: Excel.Worksheet,
  columns: IMEXColumn<D>[],
  options: ExcelValidationOptions
) => {
  const headerRow = worksheet.getRow(1)
  headerRow.font = {
    bold: true,
  }
  headerRow.border = {
    bottom: {
      style: 'medium',
      color: {
        argb: palette.neutralWhiteWithIntensityFading[500].replace('#', ''),
      },
    },
  }

  // Add extra rows for validation
  worksheet.addRows(new Array(options.extraRows ?? 50).fill([]))

  for (const columnIndex in columns) {
    const column = columns[columnIndex]
    const columnNumber = Number(columnIndex) + 1
    const dataValidation = column.meta?.imex?.dataValidation
    const isIdentifer = !!column.meta?.imex?.identifier
    if (dataValidation || isIdentifer) {
      const worksheetColumn = worksheet.getColumn(columnNumber)
      worksheetColumn.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
        if (rowNumber > 1 && cell) {
          if (dataValidation) {
            cell.dataValidation = dataValidation
          }
          if (isIdentifer && !!cell.value) {
            cell.protection = {
              locked: true,
            }
          }
        }
      })
    }
  }
}
