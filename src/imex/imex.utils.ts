import type * as Excel from 'exceljs'
import { get, reduce } from 'lodash'

import { createWorkbook } from './exceljs'
import { IMEXColumn } from './imex.types'

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

export const exportData = async <D extends {}>(
  filename: string,
  columns: IMEXColumn<D>[],
  data: any[][],
  options: { type: 'csv' | 'xls' }
) => {
  const workbook = await createWorkbook()
  const worksheet = workbook.addWorksheet(filename)

  worksheet.columns = columns.map((column) => ({
    header: column.Header,
    key: column.id ?? column.Header,
    width: column.meta?.imex?.width,
  })) as Excel.Column[]

  for (const row of data) {
    worksheet.addRow(row)
  }
  if (options.type === 'xls') {
    const fileBuffer = await workbook.xlsx.writeBuffer()
    saveFile(`${filename}.xls`, fileBuffer)
  } else {
    const fileBuffer = await workbook.csv.writeBuffer()
    saveFile(`${filename}.csv`, fileBuffer)
  }
}
