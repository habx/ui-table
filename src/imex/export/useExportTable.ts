import { get, isFinite } from 'lodash'
import * as React from 'react'

import { getImexColumns } from '../getImexColumns'
import {
  IMEXColumn,
  IMEXFileExtensionTypes,
  IMEXColumnType,
} from '../imex.interface'
import { getPath } from '../imex.utils'

import { exportData, ExportDataOptions } from './useExportTable.utils'

export interface UseExportTableParams<D extends object>
  extends Omit<ExportDataOptions, 'type'> {
  data: D[]
  columns: IMEXColumn<D>[]
  /**
   * @default 'xls'
   */
  type?: IMEXFileExtensionTypes
}

const ARRAY_TYPES = new Set<IMEXColumnType>([
  IMEXColumnType['string[]'],
  IMEXColumnType['number[]'],
])

export const useExportTable = <D extends object = any>() => {
  const downloadTableData = React.useCallback(
    (title: string, options: UseExportTableParams<D>) => {
      const { data = [], columns, type = 'xls' } = options

      const imexColumns = getImexColumns(columns)
      const imexData = data.map((row) =>
        imexColumns.map((column) => {
          const imexOptions = column.imex
          const valueType = imexOptions?.type

          const path = getPath(column)

          let value = get(row, path)

          if (imexOptions?.format) {
            value = imexOptions.format(value, Object.values(row))
          } else if (ARRAY_TYPES.has(valueType!) && Array.isArray(value)) {
            value = value.join(',')
          }

          return type === 'xls' &&
            valueType === IMEXColumnType.number &&
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
