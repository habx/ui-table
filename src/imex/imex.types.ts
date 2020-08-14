import { Column } from '../types/Table'

export enum RowValueTypes {
  string = 'string',
  'number' = 'number',
  'number[]' = 'number[]',
  'string[]' = 'string[]',
}

export type IMEXColumn<D extends { [key: string]: any } = any> = Column<
  D & { [key: string]: any },
  {
    csv?: {
      identifier?: boolean
      required?: boolean
      type: RowValueTypes
      format?: (value: any) => string
      parse?: (value: any) => any
    }
  }
>
