import * as React from 'react'

import {
  SelectFilter,
  SelectFilterProps,
} from '../filter/SelectFilter/SelectFilter'

export const selectFilterFactory = (
  options: any[],
  otherProps: Partial<SelectFilterProps> = {}
) => {
  const Component: React.FunctionComponent<Omit<SelectFilterProps, 'options'>> =
    (props) => (
      <SelectFilter
        {...props}
        options={options}
        canSelectAll
        selectAllLabel="Tout sélectionner"
        {...otherProps}
      />
    )

  return Component
}
