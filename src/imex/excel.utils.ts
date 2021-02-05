import * as Excel from 'exceljs'

export const parseExcelFileData = async (file: File): Promise<any[][]> => {
  const arrayBuffer = await file.arrayBuffer()
  const workbook = await new Excel.Workbook().xlsx.load(arrayBuffer)
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
        case Excel.ValueType.String:
        case Excel.ValueType.Boolean:
        case Excel.ValueType.Number:
        case Excel.ValueType.Date:
          data[rowIndex][cellIndex] = cell.value ?? null
          break
        case Excel.ValueType.Error:
        case Excel.ValueType.Null:
        case Excel.ValueType.Merge:
        case Excel.ValueType.SharedString:
          data[rowIndex][cellIndex] = null
          break
        case Excel.ValueType.Formula:
          data[rowIndex][cellIndex] =
            (cell.value as Excel.CellFormulaValue).result ?? null
          break
        case Excel.ValueType.Hyperlink:
          // seems to be badly typed
          const text = ((cell.value as Excel.CellHyperlinkValue)
            .text as unknown) as Excel.CellRichTextValue
          data[rowIndex][cellIndex] =
            text?.richText?.map((t) => t.text).join('') ?? text ?? null
          break
        case Excel.ValueType.RichText:
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
