import type * as Excel from 'exceljs'

import {
  applyValidationRulesAndStyle,
  ExcelValidationOptions,
} from '../excel.utils'
import { createWorkbook } from '../exceljs'
import { IMEXColumn } from '../imex.interface'

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

export interface ExportDataOptions extends ExcelValidationOptions {
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
    header: column.Header + (column.meta?.imex?.required ? '*' : ''),
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
