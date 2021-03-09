import { debounce } from 'lodash'
import * as React from 'react'

import { Icon, TextInput } from '@habx/ui-core'

import { ColumnInstance } from '../../types/Table'

export const TextFilter: React.FunctionComponent<{
  column: ColumnInstance<any>
}> = ({ column }) => {
  const [liveValue, setLiveValue] = React.useState<string | undefined>(
    column.filterValue
  )
  const handleSetFilter = debounce(column.setFilter, 500)
  const handleSetValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || undefined
    setLiveValue(value)
    handleSetFilter(value)
  }

  return (
    <TextInput
      bare
      small
      elementLeft={<Icon icon="search" />}
      value={liveValue}
      onChange={handleSetValue}
      placeholder="Rechercher"
    />
  )
}
