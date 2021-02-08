import type * as Excel from 'exceljs'

import { Column } from '../types/Table'

export type RowValueTypes = 'string' | 'number' | 'number[]' | 'string[]'

export type IMEXColumn<D extends { [key: string]: any } = any> = Column<
  D & { [key: string]: any },
  {
    imex?: {
      identifier?: boolean
      required?: boolean
      type?: RowValueTypes
      format?: (value: any, row: any[]) => any
      parse?: (value: any, row: any[]) => any
      width?: number
      validate?: (value: any, row: any[]) => string | boolean
      dataValidation?: Excel.DataValidation
      hidden?: boolean
    }
  }
>
