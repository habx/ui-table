import { Column } from '../types/Table'

export enum ColumnValueTypes {
  string = 'string',
  'number' = 'number',
  'number[]' = 'number[]',
  'string[]' = 'string[]',
  boolean = 'boolean',
}

export type IMEXColumn<D extends { [key: string]: any } = any> = Column<
  D & { [key: string]: any },
  {
    csv?: {
      identifier?: boolean
      required?: boolean
      type: ColumnValueTypes
      format?: (value: any) => string
      parse?: (value: any) => any
    }
  }
>
