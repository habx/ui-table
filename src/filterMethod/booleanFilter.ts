import { get, has } from 'lodash'
import { FilterType } from 'react-table'

export enum BooleanFilterValues {
  All = 0,
  Truthy = 1,
  Falsy = 2,
}

const booleanFilter: FilterType<any> = (rows, id, filterValue) => {
  if (filterValue === BooleanFilterValues.All) {
    return rows
  }

  return rows.filter((row) => {
    const rawValue = get(row.values, id)
    const value = has(rawValue, 'value') ? !!rawValue.value : !!rawValue

    return (
      (value && filterValue === BooleanFilterValues.Truthy) ||
      (!value && filterValue === BooleanFilterValues.Falsy)
    )
  })
}

export default booleanFilter
