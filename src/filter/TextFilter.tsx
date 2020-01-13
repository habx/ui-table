import * as React from 'react'

import { TextInput } from '@habx/lib-design-system'

import { ColumnInstance } from '../getTableComponent'

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
