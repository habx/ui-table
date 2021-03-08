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

  const handleSetFilter = React.useMemo(() => {
    if (!column.setFilter) {
      return null
    }
    return debounce(column.setFilter, 500)
  }, [column.setFilter])

  const handleSetValue = (value: string | undefined) => {
    setLiveValue(value)
    handleSetFilter?.(value)
  }

  if (!column.setFilter) {
    return null
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
