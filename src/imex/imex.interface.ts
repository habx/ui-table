import type * as Excel from 'exceljs'

import { Column } from '../types/Table'

export interface ImportedRowMeta<D extends {}> {
  prevVal?: D & { id?: string | number }
  hasDiff: boolean
  errors: Record<string, string>
  isIgnored: boolean
}

export type ImportedRow<D extends {}> = D & { _rowMeta: ImportedRowMeta<D> }

export type UseImportTableOptions<D extends object> = {
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

export type UseImportTableParams<D extends object> = {
  disabled?: boolean
  accept?: string[]
  /**
   * Defines the number of upsertRow calls parallelized.
   * @default 1
   * Use Infinity to call upsertRow for all rows at the same time.
   */
  concurrency?: number
} & UseImportTableOptions<D>

export enum IMEXColumnType {
  'string',
  'number',
  'number[]',
  'string[]',
}

export interface IMEXOptions {
  /**
   * path passed to lodash get & set function to access & define data
   * fallback to column accessor if provided as string
   *
   */
  path?: string
  /**
   * header name of the column in the sheet file
   * fallback to column Header if provided as string
   *
   */
  header?: string
  /** identify a uniq row **/
  identifier?: boolean
  required?: boolean
  /** @default IMEXColumnType.string **/
  type?: IMEXColumnType
  format?: (value: any, row: any[]) => any
  parse?: (value: any, row: any[]) => any
  width?: number
  validate?: (value: any, row: any[], prevVal?: any) => string | boolean | null
  dataValidation?: Excel.DataValidation
  hidden?: boolean
  note?: string | Excel.Comment
  ignoreEmpty?: boolean
}

export type IMEXColumn<D extends object = any> = Omit<
  Column<D>,
  'Header' | 'accessor'
> & {
  columns?: IMEXColumn<D>[]
  imex?: IMEXOptions
} & (
    | {
        Header: string
      }
    | {
        Header?: Exclude<Column<D>['Header'], string>
        imex?: { header: NonNullable<IMEXOptions['header']> }
      }
  ) &
  (
    | {
        accessor: string
      }
    | {
        accessor?: Exclude<Column<D>['accessor'], string>
        imex?: { path: NonNullable<IMEXOptions['path']> }
      }
  )

export type IMEXFileExtensionTypes = 'csv' | 'xls'

// Type tests

// @ts-expect-error
const a: IMEXColumn = { // eslint-disable-line
  Header: '',
  accessor: () => '',
  imex: {},
}

const b: IMEXColumn = { // eslint-disable-line
  // @ts-expect-error
  Header: () => '',
  accessor: '',
  imex: {},
}
