const getExcelJs = async () => (await import('exceljs')).default

export const getCellValueTypes = async () => {
  const excelJS = await getExcelJs()

  return excelJS.ValueType
}

export const createWorkbook = async () => {
  const excelJS = await getExcelJs()

  return new excelJS.Workbook()
}
