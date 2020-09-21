import { get, has } from 'lodash'
import { FilterType } from 'react-table'

const booleanFilter: FilterType<any> = (rows, id, filterValue) => {
  if (filterValue == null) {
    return rows
  }

  return rows.filter((row) => {
    const rawValue = get(row.values, id)
    const value = has(rawValue, 'value') ? !!rawValue.value : !!rawValue

    return (value && filterValue === true) || (!value && filterValue === false)
  })
}

export default booleanFilter
