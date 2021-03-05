import { FilterType, Row } from 'react-table'

/**
 * @deprecated use filters: 'includes' instead
 */
const arrayFilter = <D extends object>(
  accessor: (row: Row<D>) => any
): FilterType<D> => (rows, columnId, filterValue) => {
  return rows.filter((row) => {
    return filterValue?.some((value: any) => `${accessor(row)}`.includes(value))
  })
}

export default arrayFilter
