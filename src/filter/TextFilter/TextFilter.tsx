import { debounce } from 'lodash'
import * as React from 'react'

import { TextInput } from '@habx/ui-core'

import { ColumnInstance } from '../../types/Table'

export const TextFilter: React.FunctionComponent<{
  column: ColumnInstance<any>
}> = ({ column }) => {
  const [liveValue, setLiveValue] = React.useState<string | undefined>(
    column.filterValue
  )
  const handleSetFilter = debounce(column.setFilter, 500)
  const handleSetValue = (value: string | undefined) => {
    setLiveValue(value)
    handleSetFilter(value)
  }

  return (
    <TextInput
      small
      value={liveValue}
      onChange={(e) => handleSetValue(e.target.value || undefined)}
      placeholder="Filtrer"
    />
  )
}
