import { get, isNumber } from 'lodash'
import * as React from 'react'

import { ExcelValidationOptions } from './excel.utils'
import getImexColumns from './getImexColumns'
import { IMEXColumn } from './imex.types'
import { exportData } from './imex.utils'

export interface UseExportIMEXParams<D extends { [key: string]: any } = any>
  extends ExcelValidationOptions {
  data?: D[]
  columns: IMEXColumn<D>[]
  type?: 'csv' | 'xls'
}

const useExportTable = <D extends { [key: string]: any } = any>(
  params: UseExportIMEXParams<D>
) => {
  const downloadTableData = React.useCallback(
    (title: string, options: Partial<UseExportIMEXParams<D>> = {}) => {
      const { data = [], columns, type = 'csv', ...exportOptions } = {
        ...params,
        ...options,
      }

      const imexColumns = getImexColumns(columns)
      const imexData = data.map((row) =>
        imexColumns.map(({ accessor, meta }) => {
          let value = get(row, accessor as string)
          const parse = (v: any) =>
            meta?.imex?.parse?.(v, Object.values(row)) ?? v
          if (type === 'xls' && meta?.imex?.type === 'number') {
            return isNumber(value) ? `${parse(value)}`.replace('.', ',') : value
          }
          return parse(value)
        })
      )
      return exportData<D>(title, imexColumns, imexData, {
        type,
        ...exportOptions,
      })
    },
    Object.values(params) // eslint-disable-line
    // options object in "downloadCsv" function is overwriting params so we need all params
    // However, the params object will change at each render and
    // we want shallow compare of each property of params without spreading it outside of the function
    // so we can't forgot any props
  )
  return [downloadTableData] as const
}

export default useExportTable
