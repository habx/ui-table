import { get, has } from 'lodash'
import { FilterType } from 'react-table'

const booleanFilter: FilterType<any> = (rows, id, filterValue) =>
  rows.filter(row => {
    const rawValue = get(row.values, id)
    const value = has(rawValue, 'value') ? !!rawValue.value : !!rawValue

    return (value && filterValue) || (!value && !filterValue)
  })

export default booleanFilter
