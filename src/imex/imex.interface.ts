import { DropEvent } from 'react-dropzone'

import { IMEXColumn } from './imex.types'

export interface ImportedRowMeta<D extends {}> {
  prevVal?: D
  hasDiff: boolean
  errors: Record<string, string>
}

export type ImportedRow<D extends {}> = D & { _rowMeta: ImportedRowMeta<D> }

export interface UseImportTableOptions<D extends { [key: string]: any } = any> {
  columns: IMEXColumn<D>[]
  upsertRow: (row: D | D[]) => any
  getOriginalData: () => D[] | Promise<D[]>
  onFinish?: (rows: D[] | D[][]) => void
  readFile?: (file: File) => Promise<any[]>
  filterRows?: (row: ImportedRow<D>) => boolean
  groupBy?: string
  confirmLightBoxTitle?: string
  /**
   * Use this predicate instead of simple comparison with identifier column
   * @param originalDataRow
   * @param row
   */
  findPrevValPredicate?: (originalDataRow: D, row: Partial<D>) => boolean
}

export interface UseImportTableParams<D> extends UseImportTableOptions<D> {
  disabled?: boolean
  accept?: string[]
  onBeforeDropAccepted?: (
    onFiles: (
      files: File[],
      options?: Partial<UseImportTableOptions<D>>
    ) => Promise<void>
  ) => (files: File[], event?: DropEvent) => Promise<void>
}
