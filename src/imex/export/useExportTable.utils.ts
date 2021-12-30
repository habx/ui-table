import type * as Excel from 'exceljs'

import {
  applyValidationRulesAndStyle,
  ExcelValidationOptions,
} from '../excel.utils'
import { createWorkbook } from '../exceljs'
import { IMEXColumn, IMEXFileExtensionTypes } from '../imex.interface'
import { getHeader } from '../imex.utils'

const saveFile = (
  type: IMEXFileExtensionTypes,
  filename: string,
  content: BlobPart
) => {
  const blob = new Blob([content], {
    type:
      type === 'xls'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'text/csv;charset=utf-8',
  })

  filename += `.${type === 'xls' ? 'xlsx' : 'csv'}`

  // @ts-ignore
  const msSaveBlob = navigator.msSaveBlob
  if (msSaveBlob) {
    // IE 10+
    msSaveBlob(blob, filename)
  } else {
    const link = document.createElement('a')
    if (link.download !== undefined) {
      /*
       * feature detection
       * Browsers that support HTML5 download attribute
       */
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
  /**
   * Allows to edit workbook instance before saving.
   */
  editWorkbookBeforeSave?: (workbook: Excel.Workbook) => void | Promise<void>

  type: IMEXFileExtensionTypes
}

export const exportData = async <D extends {}>(
  filename: string,
  columns: IMEXColumn<D>[],
  data: any[][],
  options: ExportDataOptions
) => {
  const workbook = await createWorkbook()
  const worksheet = workbook.addWorksheet(filename)

  worksheet.columns = columns.map((column) => ({
    header: `${getHeader(column)} ${column.imex?.required ? '*' : ''}`,
    key: column.id ?? column.imex,
    width: column.imex?.width,
    hidden: column.imex?.hidden,
  })) as Excel.Column[]

  worksheet.addRows(data)
  await options.editWorkbookBeforeSave?.(workbook)

  let content: Excel.Buffer

  if (options.type === 'xls') {
    applyValidationRulesAndStyle<D>(worksheet, columns, options)
    content = await workbook.xlsx.writeBuffer()
  } else {
    content = await workbook.csv.writeBuffer()
  }

  saveFile(options.type, filename, content)
}
