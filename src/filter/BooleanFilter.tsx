import * as React from 'react'

import { Select } from '@habx/lib-design-system'

import { ColumnInstance } from '../getTableComponent'

const OPTIONS = [
  { label: 'Tout', value: null },
  { label: 'Oui', value: true },
  { label: 'Non', value: false },
]

const BooleanFilter: React.FunctionComponent<{
  column: ColumnInstance<any>
}> = ({ column }) => {
  const value = React.useMemo(() => {
    const rawValue = column.filterValue

    if (rawValue === true || rawValue === false) {
      return rawValue
    }

    return null
  }, [column.filterValue])

  return (
    <Select
      small
      canReset={false}
      value={value}
      onChange={value => column.setFilter(value == null ? undefined : value)}
      options={OPTIONS}
    />
  )
}

export default BooleanFilter
