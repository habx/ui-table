import * as React from 'react'

import { Select } from '@habx/ui-core'

import { BooleanFilterValues } from '../filterMethod/booleanFilter'
import { ColumnInstance } from '../types/Table'

const OPTIONS = [
  { label: 'Tout', value: BooleanFilterValues.All },
  { label: 'Oui', value: BooleanFilterValues.Truthy },
  { label: 'Non', value: BooleanFilterValues.Falsy },
]

const BooleanFilter: React.FunctionComponent<BooleanFilterProps> = ({
  column,
}) => (
  <Select
    small
    canReset={false}
    value={column?.filterValue ?? BooleanFilterValues.All}
    onChange={(newValue) => column.setFilter(newValue)}
    options={OPTIONS}
  />
)

interface BooleanFilterProps {
  column: ColumnInstance<any>
}

export default BooleanFilter
