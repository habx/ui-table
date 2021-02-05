import type * as Excel from 'exceljs'

const getExcelJs = () => require('exceljs')

export const getCellValueTypes = () => getExcelJs().ValueType

export const createWorkbook = () => {
  const excelJS = getExcelJs()
  return new excelJS.Workbook() as Excel.Workbook
}
