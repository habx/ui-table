import { get, isNumber } from 'lodash'
import * as React from 'react'

import getImexColumns from './getImexColumns'
import { IMEXColumn } from './imex.types'
import { exportData } from './imex.utils'

type UseExportCsvParams<D extends { [key: string]: any } = any> = {
  data?: D[]
  columns: IMEXColumn<D>[]
  type?: 'csv' | 'xls'
}

const useExportTable = <D extends { [key: string]: any } = any>(
  params: UseExportCsvParams<D>
) => {
  const downloadTableData = React.useCallback(
    (title: string, options: Partial<UseExportCsvParams<D>> = {}) => {
      const { type = 'csv', data = [], columns } = { ...params, ...options }

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
      return exportData<D>(title, imexColumns, imexData, { type })
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
