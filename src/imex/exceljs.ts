import type * as Excel from 'exceljs'

const getExcelJs = () => import('exceljs')

export const getCellValueTypes = async () => {
  const excelJS = await getExcelJs()

  return excelJS.ValueType
}

export const createWorkbook = async () => {
  const excelJS = await getExcelJs()
  return new excelJS.Workbook() as Excel.Workbook
}
