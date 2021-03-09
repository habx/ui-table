import { get } from 'lodash'
import * as React from 'react'

import { SelectProps, Select } from '@habx/ui-core'

import { Column } from '../../index'

export const SelectFilter = React.forwardRef<HTMLDivElement, SelectFilterProps>(
  (props, ref) => {
    const { options, multi = false, column, ...other } = props
    const defaultValue = React.useMemo(
      () => (multi || !other.canSelectAll ? undefined : 'all'),
      [multi, other.canSelectAll]
    )
    const filter = column.filterValue
    const handleChange = column.setFilter
    const placeholder = React.useMemo(
      () =>
        multi
          ? `${get(filter, 'value.length', options.length)} sélectionnés`
          : undefined,
      [multi, filter, options.length]
    )
    const selectOptions = React.useMemo(
      () =>
        multi || !other.canSelectAll
          ? options
          : [{ value: 'all', label: 'Tout' }, ...options],
      [options, multi, other.canSelectAll]
    )

    return (
      <Select
        ref={ref}
        bare
        small
        style={{ width: '100%' }}
        value={filter ?? defaultValue}
        options={selectOptions}
        canReset={!!multi}
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
