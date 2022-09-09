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
  IMEXColumnType,
  UseImportTableOptions,
  UseImportTableParams,
} from '../imex.interface'
import { getHeader, getPath } from '../imex.utils'

export enum ParseCellError {
  NOT_A_NUMBER,
  INVALID,
  REQUIRED,
}
export const ParsingErrors: Record<ParseCellError, string> = {
  [ParseCellError.NOT_A_NUMBER]: 'Nombre invalide',
  [ParseCellError.INVALID]: 'Valeur invalide',
  [ParseCellError.REQUIRED]: 'Valeur requise',
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

const isNotEmptyCell = (cell: any) => cell !== '' && cell != null

export const parseCell = (
  rawCell: any,
  type: IMEXColumnType,
  options: { parse: (value: any) => any; ignoreEmpty: boolean }
): string | number | string[] | number[] | undefined => {
  if (options.ignoreEmpty && !isNotEmptyCell(rawCell)) {
    return undefined
  }
  switch (type) {
    case IMEXColumnType.number:
      if (typeof rawCell === 'number') {
        return Number(options.parse(rawCell))
      }
      const newCellValue = Number(options.parse(rawCell?.replace(',', '.')))
      if (Number.isNaN(newCellValue)) {
        throw new Error(ParsingErrors[ParseCellError.NOT_A_NUMBER])
      }
      return newCellValue
    case IMEXColumnType['number[]']:
      let parsedNumberArrayCell = options.parse(rawCell)
      if (!Array.isArray(parsedNumberArrayCell)) {
        if (typeof parsedNumberArrayCell !== 'string') {
          throw new Error(ParsingErrors[ParseCellError.INVALID])
        }
        parsedNumberArrayCell = parsedNumberArrayCell.split(',')
      }
      return parsedNumberArrayCell
        .filter(isNotEmptyCell)
        .map((value: string | number) => {
          const transformedValue = Number(value)
          if (Number.isNaN(transformedValue)) {
            throw new Error(ParsingErrors[ParseCellError.NOT_A_NUMBER])
          }
          return transformedValue
        })

    case IMEXColumnType['string[]']:
      let parsedStringArrayCell = options.parse(rawCell)
      if (!Array.isArray(parsedStringArrayCell)) {
        if (typeof parsedStringArrayCell !== 'string') {
          throw new Error(ParsingErrors[ParseCellError.INVALID])
        }
        parsedStringArrayCell = parsedStringArrayCell.split(',')
      }
      return parsedStringArrayCell.filter(isNotEmptyCell)
    default:
      return options.parse(rawCell)
  }
}

const cleanHeader = (header: string | number | {}) =>
  lowerCase(deburr(`${header}`))

interface ParseDataParams<D extends {}> {
  data: any[][]
  originalData: D[]
  columns: IMEXColumn<ImportedRow<D>>[]
}

export const parseRawData = async <D extends { id?: string | number }>(
  params: ParseDataParams<D>,
  options: Pick<
    UseImportTableOptions<D>,
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
    (column) => column.imex?.identifier
  )
  if (!identifierColumn) {
    throw new Error('Missing identifier column')
  }
  const requiredColumnHeaders = params.columns
    .filter((column) => column?.imex?.required)
    .map((column) => cleanHeader(getHeader(column)))

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
      const searchedHeader = cleanHeader(getHeader(imexColumn))
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
      isIgnored: false,
    }
    const importedRowValue: Partial<D> = {}

    const rawRowValues = Object.values(row)

    for (let index = 0; index < rawRowValues.length; index++) {
      const rawCell = rawRowValues[index]
      const currentColumn = orderedColumns[index]
      if (!currentColumn) {
        continue
      }

      const columnDataPath = getPath(currentColumn)

      let cellError: string | null = null

      const parse = (value: any) =>
        currentColumn.imex?.parse?.(value, row) ?? value

      let newCellValue: string | number | string[] | number[] | undefined =
        rawCell

      const ignoreEmpty = currentColumn.imex?.ignoreEmpty ?? true

      /**
       * Previous value
       */
      const prevValIdentifier = get(importedRowValue, getPath(identifierColumn))
      const prevValIndex = originalData.findIndex((originalRow) => {
        if (options.findPrevValPredicate) {
          return options.findPrevValPredicate(originalRow, importedRowValue)
        }
        return get(originalRow, getPath(identifierColumn)) === prevValIdentifier
      })

      importedRowMeta.prevVal = originalData[prevValIndex]

      try {
        newCellValue = parseCell(
          rawCell,
          currentColumn.imex?.type as IMEXColumnType,
          { parse, ignoreEmpty }
        )

        // If parsed value is null, throw if required and ignore if not.
        if (newCellValue == null) {
          if (currentColumn.imex?.required) {
            throw new Error(ParsingErrors[ParseCellError.REQUIRED])
          } else if (ignoreEmpty) {
            continue
          }
        }

        const validate = currentColumn.imex?.validate ?? (() => true)
        const validateResponse = validate(
          newCellValue,
          row,
          importedRowMeta.prevVal
        )

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
        if (e instanceof Error) {
          cellError = e.message
        }
      }

      /**
       * Add errors on row and add ignore flag
       */
      if (cellError) {
        importedRowMeta.isIgnored = true
        set(importedRowMeta.errors, columnDataPath, cellError)
      }

      set(importedRowValue, columnDataPath, newCellValue)
    }

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
      if (groupedParsedData[rowGroup].some((row) => row._rowMeta.isIgnored)) {
        // @ts-ignore do not know how to fix this
        groupedParsedData[rowGroup] = groupedParsedData[rowGroup].map(
          (row) => ({
            ...row,
            _rowMeta: {
              ...row._rowMeta,
              isIgnored: true,
            },
          })
        )
      }
      if (
        groupedParsedData[rowGroup].some(
          (row) => row._rowMeta.hasDiff || options.filterRows?.(row)
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

export const validateOptions = <D extends object>(
  options: UseImportTableParams<D>
) => {
  if (options.concurrency && options.concurrency < 1) {
    throw new Error('concurrency should be greater than 1')
  }
}
