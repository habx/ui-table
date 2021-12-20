import type * as Excel from 'exceljs'
import { DropEvent } from 'react-dropzone'

import { Column } from '../types/Table'

export interface ImportedRowMeta<D extends {}> {
  prevVal?: D & { id?: string | number }
  hasDiff: boolean
  errors: Record<string, string>
  isIgnored: boolean
}

export type ImportedRow<D extends {}> = D & { _rowMeta: ImportedRowMeta<D> }

export type UseImportTableOptions<D> = {
  columns: IMEXColumn<D>[]
  onUpsertRowError?: (error: Error) => void
  getOriginalData: () => D[] | Promise<D[]>
  readFile?: (file: File) => Promise<any[]>
  filterRows?: (row: ImportedRow<D>) => boolean
  confirmLightBoxTitle?: string
  /**
   * Use this predicate instead of simple comparison with identifier column
   * @param originalDataRow
   * @param row
   */
  findPrevValPredicate?: (originalDataRow: D, row: Partial<D>) => boolean
  /**
   * Skip step that allows to download ignored rows
   * @default false
   */
  skipIgnoredRowsExport?: boolean
} & (
  | (_UseImportTableOptions<D> & { groupBy?: never })
  | (_UseImportTableOptions<D[]> & { groupBy: string })
)

export interface _UseImportTableOptions<D> {
  upsertRow?: (row: D) => any
  onFinish?: (rows: D[]) => void | Promise<any>
}

export type UseImportTableParams<D> = {
  disabled?: boolean
  accept?: string[]
  /**
   * @deprecated
   */
  onBeforeDropAccepted?: (
    onFiles: (
      files: File[],
      options?: Partial<UseImportTableOptions<D>>
    ) => Promise<void>
  ) => (files: File[], event?: DropEvent) => Promise<void>

  /**
   * Defines the number of upsertRow calls parallelized.
   * @default 1
   * Use Infinity to call upsertRow for all rows at the same time.
   */
  concurrency?: number
} & UseImportTableOptions<D>

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
      validate?: (value: any, row: any[]) => string | boolean | null
      dataValidation?: Excel.DataValidation
      hidden?: boolean
      note?: string | Excel.Comment
      ignoreEmpty?: boolean
    }
  }
>

export type IMEXFileExtensionTypes = 'csv' | 'xls'
