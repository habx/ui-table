import {
  deburr,
  difference,
  get,
  lowerCase,
  reduce,
  set,
  groupBy,
} from 'lodash'

import {
  IMEXColumn,
  ImportedRow,
  ImportedRowMeta,
  RowValueTypes,
  UseImportTableOptions,
} from '../imex.interface'

export enum ParseCellError {
  NOT_A_NUMBER,
  INVALID,
}
export const ParsingErrors: Record<ParseCellError, string> = {
  [ParseCellError.NOT_A_NUMBER]: 'Nombre invalide',
  [ParseCellError.INVALID]: 'Valeur invalide',
}

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

export const parseCell = (
  rawCell: any,
  type: RowValueTypes,
  options: { format: (value: any) => any }
): string | number | string[] | number[] => {
  switch (type) {
    case 'number':
      if (typeof rawCell === 'number') {
        return Number(options.format(rawCell))
      }
      const newCellValue = Number(options.format(rawCell.replace(',', '.')))
      if (Number.isNaN(newCellValue)) {
        throw new Error(ParsingErrors[ParseCellError.NOT_A_NUMBER])
      }
      return newCellValue
    case 'number[]':
      return options
        .format(rawCell)
        .split(',')
        .map((value: string | number) => {
          const transformedValue = Number(value)
          if (Number.isNaN(transformedValue)) {
            throw new Error(ParsingErrors[ParseCellError.NOT_A_NUMBER])
          }
          return transformedValue
        })
    case 'string[]':
      return options.format(rawCell).split(',')
    default:
      return options.format(rawCell)
  }
}

const cleanHeader = (header: string | number | {}) =>
  lowerCase(deburr(`${header}`))

interface ParseDataParams<D> {
  data: any[][]
  originalData: D[]
  columns: IMEXColumn<ImportedRow<D>>[]
}
export const parseRawData = async <D extends { id?: string | number }>(
  params: ParseDataParams<D>,
  options: Pick<
    UseImportTableOptions,
    'findPrevValPredicate' | 'filterRows' | 'groupBy'
  >
) => {
  // clone original data array
  const originalData = [...params.originalData]

  const headers = params.data.shift()?.map(cleanHeader)
  if (!headers) {
    throw new Error('Missing headers row')
  }
  const identifierColumn = params.columns.find(
    (column) => column.meta?.imex?.identifier
  )
  if (!identifierColumn) {
    throw new Error('Missing identifier column')
  }
  const requiredColumnHeaders = params.columns
    .filter((column) => column.meta?.imex?.required)
    .map((column) => cleanHeader(column.Header as string))

  const missingRequiredColumns = difference(
    requiredColumnHeaders as string[],
    headers
  )
  if (missingRequiredColumns.length > 0) {
    throw new Error(`${missingRequiredColumns.join(', ')} manquants`)
  }

  const ignoredColumns = []
  const orderedColumns = headers.map((header) => {
    const column = params.columns.find((imexColumn) => {
      const searchedHeader = cleanHeader(imexColumn.Header as string)
      const cleanedHeader = requiredColumnHeaders.includes(searchedHeader)
        ? header.replace(/\*$/, '')
        : header

      return searchedHeader === cleanedHeader
    })

    if (!column) {
      ignoredColumns.push(header)
    }
    return column
  })

  const filteredData = params.data.filter(
    (row: string[] | null) =>
      row?.length === headers?.length && row.some((cell) => !!cell)
  )

  const parsedData: ImportedRow<D>[] = []
  for (const row of filteredData) {
    const importedRowMeta: ImportedRowMeta<D> = {
      hasDiff: false,
      errors: {},
    }

    const importedRowValue: Partial<D> = {}

    const rawRowValues = Object.values(row)
    for (let index = 0; index < rawRowValues.length; index++) {
      const rawCell = rawRowValues[index]
      if (!orderedColumns[index]) {
        continue
      }

      let cellError: string | null = null
      if (
        requiredColumnHeaders.includes(
          cleanHeader(orderedColumns[index]?.Header as string)
        ) &&
        rawCell?.length === 0
      ) {
        cellError = 'requise'
      }
      if (rawCell === '' || rawCell === undefined) {
        continue
      }

      const format = (value: any) =>
        orderedColumns[index]?.meta?.imex?.format?.(value, row) ?? `${value}`

      // cast to string for default value to avoid render error
      let newCellValue: string | number | string[] | number[] = `${rawCell}`

      try {
        newCellValue = parseCell(
          rawCell,
          orderedColumns[index]!.meta!.imex!.type as RowValueTypes,
          { format }
        )

        const validate =
          orderedColumns[index]?.meta?.imex?.validate ?? (() => true)
        const validateResponse = validate(newCellValue, row)
        const isValid =
          typeof validateResponse === 'string'
            ? !validateResponse.length
            : !!validateResponse
        if (!isValid) {
          throw new Error(
            typeof validateResponse === 'string'
              ? validateResponse
              : ParsingErrors[ParseCellError.INVALID]
          )
        }
      } catch (e) {
        cellError = e.message
      }

      if (cellError) {
        set(
          importedRowMeta.errors,
          orderedColumns[index]?.accessor as string,
          cellError
        )
      }

      set(
        importedRowValue,
        orderedColumns[index]?.accessor as string,
        newCellValue
      )
    }

    /**
     * Previous value
     */
    const prevValIdentifier = get(
      importedRowValue,
      identifierColumn.accessor as string
    )
    const prevValIndex = originalData.findIndex((originalRow) => {
      if (options.findPrevValPredicate) {
        return options.findPrevValPredicate(originalRow, importedRowValue)
      }
      return (
        get(originalRow, identifierColumn.accessor as string) ===
        prevValIdentifier
      )
    })

    importedRowMeta.prevVal = originalData[prevValIndex]
    originalData.splice(prevValIndex, 1) // remove from original array

    /**
     * Diff
     */
    importedRowMeta.hasDiff = !softCompare(
      importedRowValue,
      importedRowMeta.prevVal
    )

    parsedData.push({
      ...(importedRowValue as D),
      _rowMeta: importedRowMeta as ImportedRowMeta<D>,
      id: importedRowMeta.prevVal?.id ?? undefined,
    })
  }

  /**
   * If one of the row included in the group has been modified or added, we display existing values of the group.
   */
  if (options.groupBy) {
    let filteredGroupedParsedData: ImportedRow<D>[][] = []
    const groupedParsedData = groupBy(parsedData, options.groupBy)
    for (const rowGroup in groupedParsedData) {
      if (
        groupedParsedData[rowGroup].some(
          (row) => row._rowMeta.hasDiff && options.filterRows?.(row)
        )
      ) {
        filteredGroupedParsedData.push(groupedParsedData[rowGroup])
      }
    }

    return filteredGroupedParsedData.flat()
  }

  /**
   * Display only modified rows or rows validated by the custom filter function
   */
  return parsedData.filter((imexRow) => {
    if (imexRow._rowMeta.hasDiff) {
      return true
    }
    return options.filterRows?.(imexRow)
  })
}
