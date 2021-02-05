import type * as Excel from 'exceljs'

import { createWorkbook, getCellValueTypes } from './exceljs'

export const parseExcelFileData = async (file: File): Promise<any[][]> => {
  const CellValueType = getCellValueTypes()

  const arrayBuffer = await file.arrayBuffer()
  const workbook = await createWorkbook().xlsx.load(arrayBuffer)
  const worksheet = workbook.worksheets[0]

  const data: any[][] = []

  worksheet.eachRow((row, _rowIndex) => {
    // Indexes start at 1
    const rowIndex = _rowIndex - 1
    data[rowIndex] = []
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
