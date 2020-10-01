let XLSX: any
const getXLSX = async () => {
  if (XLSX) {
    return XLSX
  }
  return await import('xlsx')
}

export const readXLS = async (file: File) => {
  const xlsx = await getXLSX()
  const arrayBuffer = await file.arrayBuffer()
  const workBook = xlsx.read(arrayBuffer, { type: 'array' })
  return xlsx.utils.sheet_to_csv(workBook.Sheets[workBook.SheetNames[0]])
}

export const exportXLS = async (filename: string, data: any[][]) => {
  const xlsx = await getXLSX()

  const [headers, ...rows] = data

  const jsonData = []
  for (const rowIndex in rows) {
    const row = rows[rowIndex]
    const rowJsonData: Record<string, string> = {}
    for (const headerIndex in headers) {
      rowJsonData[headers[headerIndex]] = Array.isArray(row[headerIndex])
        ? row[headerIndex].join(',')
        : row[headerIndex]
    }
    jsonData.push(rowJsonData)
  }

  if (!jsonData.length) {
    const emptyRow = headers.reduce(
      (ctx, header) => ({
        ...ctx,
        [header]: '',
      }),
      {}
    )
    jsonData.push(emptyRow)
  }

  const workSheet = xlsx.utils.json_to_sheet(jsonData)
  const workBook = xlsx.utils.book_new()
  xlsx.utils.book_append_sheet(workBook, workSheet, 'export')
  xlsx.writeFile(workBook, filename)
}
