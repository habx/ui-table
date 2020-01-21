import * as React from 'react'

import { TextInput } from '@habx/ui-core'

import { ColumnInstance } from '../types/Table'

const TextFilter: React.FunctionComponent<{ column: ColumnInstance<any> }> = ({
  column,
}) => (
  <TextInput
    small
    value={column.filterValue}
    onChange={e => column.setFilter(e.target.value || undefined)}
    placeholder="Filtrer"
  />
)

export default TextFilter
