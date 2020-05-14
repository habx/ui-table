import { get } from 'lodash'
import * as React from 'react'

import { Select, SelectProps } from '@habx/ui-core'

import styled from 'styled-components'

import { Column } from '..'

const StyledSelect = styled(Select)`
  width: 100%;
`

const SelectFilter = React.forwardRef<HTMLDivElement, SelectFilterProps>(
  (props, ref) => {
    const { options, multi = false, column, ...other } = props
    const defaultValue = React.useMemo(() => (multi ? undefined : 'all'), [
      multi,
    ])
    const filter = column.filterValue
    const handleChange = column.setFilter
    const placeholder = React.useMemo(
      () =>
        multi
          ? `${get(filter, 'value.length', options.length)} selectionnés`
          : undefined,
      [multi, filter, options.length]
    )
    const selectOptions = React.useMemo(
      () => (multi ? options : [{ value: 'all', label: 'Tout' }, ...options]),
      [options, multi]
    )

    return (
      <StyledSelect
        ref={ref}
        style={{ width: '100%' }}
        value={filter ?? defaultValue}
        options={selectOptions}
        canReset={!!multi}
        small
        placeholder={placeholder}
        multi={multi}
        onChange={handleChange}
        {...other}
      />
    )
  }
)

export interface SelectFilterProps extends SelectProps {
  column: Column<any>
}

export default SelectFilter
