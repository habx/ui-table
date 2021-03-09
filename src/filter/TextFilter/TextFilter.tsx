import { debounce } from 'lodash'
import * as React from 'react'

import { Icon } from '@habx/ui-core'

import { ColumnInstance } from '../../types/Table'

import { TextFilterInput } from './TextFilter.style'

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
    <TextFilterInput
      small
      elementLeft={<Icon icon="search" />}
      value={liveValue}
      onChange={handleSetValue}
      placeholder="Rechercher"
    />
  )
}
