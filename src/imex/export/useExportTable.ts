import { get, isFinite } from 'lodash'
import * as React from 'react'

import { getImexColumns } from '../getImexColumns'
import {
  IMEXColumn,
  IMEXFileExtensionTypes,
  RowValueTypes,
} from '../imex.interface'

import { exportData, ExportDataOptions } from './useExportTable.utils'

export interface UseExportTableParams<D extends object = any>
  extends Omit<ExportDataOptions, 'type'> {
  data: D[]
  columns: IMEXColumn<D>[]
  /**
   * @default 'xls'
   */
  type?: IMEXFileExtensionTypes
}

const ARRAY_TYPES = new Set<RowValueTypes>(['string[]', 'number[]'])

export const useExportTable = <D extends object>() => {
  const downloadTableData = React.useCallback(
    (title: string, options: UseExportTableParams<D>) => {
      const { data = [], columns, type = 'xls' } = options

      const imexColumns = getImexColumns(columns)
      const imexData = data.map((row) =>
        imexColumns.map((column) => {
          const imexOptions = column?.imex
          const valueType = imexOptions?.type

          let value = get(row, column.accessor as string)

          if (imexOptions?.format) {
            value = imexOptions.format(value, Object.values(row))
          } else if (ARRAY_TYPES.has(valueType!) && Array.isArray(value)) {
            value = value.join(',')
          }

          return type === 'xls' &&
            valueType === 'number' &&
            !isFinite(value) &&
            value != null
            ? Number(value)
            : value
        })
      )

      return exportData(title, imexColumns, imexData, { ...options, type })
    },
    []
  )

  return [downloadTableData] as const
}
