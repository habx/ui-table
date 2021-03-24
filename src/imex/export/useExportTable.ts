import { get, isNumber } from 'lodash'
import * as React from 'react'

import { getImexColumns } from '../getImexColumns'
import { IMEXColumn } from '../imex.interface'

import { exportData, ExportDataOptions } from './useExportTable.utils'

export interface UseExportIMEXParams<D extends { [key: string]: any } = any>
  extends Omit<ExportDataOptions, 'type'> {
  data?: D[]
  columns: IMEXColumn<D>[]
  type?: 'csv' | 'xls'
}

export const useExportTable = <D extends { [key: string]: any } = any>(
  params: UseExportIMEXParams<D>
) => {
  // Put params in ref to avoid useless changes of `onFiles` function
  const paramsRef = React.useRef(params)
  paramsRef.current = params

  const downloadTableData = React.useCallback(
    (title: string, options: Partial<UseExportIMEXParams<D>> = {}) => {
      const { data = [], columns, type = 'csv', ...exportOptions } = {
        ...paramsRef.current,
        ...options,
      }

      const imexColumns = getImexColumns(columns)
      const imexData = data.map((row) =>
        imexColumns.map(({ accessor, meta }) => {
          let value = get(row, accessor as string)
          const parse = (v: any) => {
            if (
              !meta?.imex?.parse &&
              ['string[]', 'number[]'].includes(
                meta?.imex?.type as 'string[]' | 'number[]'
              )
            ) {
              return v?.join(',')
            }
            return meta?.imex?.parse?.(v, Object.values(row)) ?? v
          }
          if (type === 'xls' && meta?.imex?.type === 'number') {
            return isNumber(value) ? Number(parse(value)) : value
          }
          return parse(value)
        })
      )
      return exportData<D>(title, imexColumns, imexData, {
        type,
        ...exportOptions,
      })
    },
    []
  )
  return [downloadTableData] as const
}
