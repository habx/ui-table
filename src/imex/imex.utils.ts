import { IMEXColumn } from './imex.interface'

export const getPath = <D extends object>(column: IMEXColumn<D>) =>
  (typeof column.accessor === 'string'
    ? column.accessor
    : column.imex!.path) as string
export const getHeader = <D extends object>(column: IMEXColumn<D>) =>
  (typeof column.Header === 'string'
    ? column.Header
    : column.imex!.header) as string
