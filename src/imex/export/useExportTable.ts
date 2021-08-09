import { get, isNumber } from 'lodash'
import * as React from 'react'

import { getImexColumns } from '../getImexColumns'
import {
  IMEXColumn,
  IMEXFileExtensionTypes,
  RowValueTypes,
} from '../imex.interface'

import { exportData, ExportDataOptions } from './useExportTable.utils'

export interface UseExportTableParams<D extends { [key: string]: any } = any>
  extends Omit<ExportDataOptions, 'type'> {
  data?: D[]
  columns: IMEXColumn<D>[]
  type?: IMEXFileExtensionTypes
}

const ARRAY_TYPES = new Set<RowValueTypes>(['string[]', 'number[]'])

export const useExportTable = <D extends { [key: string]: any } = any>(
  params: UseExportTableParams<D>
) => {
  // Put params in ref to avoid useless changes of `onFiles` function
  const paramsRef = React.useRef(params)
  paramsRef.current = params

  const downloadTableData = React.useCallback(
    (title: string, options?: Partial<UseExportTableParams<D>>) => {
      const { data, columns, ...exportOptions } = {
        data: [],
        type: 'xls',
        ...paramsRef.current,
        ...options,
      } as const

      const imexColumns = getImexColumns(columns)
      const imexData = data.map((row) =>
        imexColumns.map((column) => {
          const meta = column.meta?.imex
          const valueType = meta?.type

          let value = get(row, column.accessor as string)

          if (meta?.parse) {
            value = meta.parse(value, Object.values(row))
          } else if (ARRAY_TYPES.has(valueType!) && Array.isArray(value)) {
            value = value.join(',')
          }

          return exportOptions.type === 'xls' &&
            valueType === 'number' &&
            !isNumber(value)
            ? Number(value)
            : value
        })
      )

      return exportData(title, imexColumns, imexData, exportOptions)
    },
    []
  )

  return [downloadTableData] as const
}
