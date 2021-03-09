import * as React from 'react'

import { Select } from '@habx/ui-core'

import { ColumnInstance } from '../../types/Table'

const OPTIONS_WITHOUT_NULL = [
  { label: 'Oui', value: true },
  { label: 'Non', value: false },
]

const OPTIONS_WITH_NULL = [
  { label: 'Tout', value: null },
  ...OPTIONS_WITHOUT_NULL,
]

export const BooleanFilter: React.FunctionComponent<BooleanFilterProps> = ({
  column,
  canBeNull = true,
}) => {
  const rawValue = column.filterValue ?? null

  return (
    <Select
      small
      bare
      canReset={false}
      value={canBeNull ? rawValue : !!rawValue}
      onChange={(newValue) => column.setFilter(newValue)}
      options={canBeNull ? OPTIONS_WITH_NULL : OPTIONS_WITHOUT_NULL}
    />
  )
}

interface BooleanFilterProps {
  column: ColumnInstance<any>
  canBeNull?: boolean
}
