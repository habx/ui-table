import * as React from 'react'

import SelectFilter, { SelectFilterProps } from '../filter/SelectFilter'

const selectFilterFactory = (
  options: any[],
  otherProps: Partial<SelectFilterProps> = {}
) => {
  const Component: React.FunctionComponent<Omit<
    SelectFilterProps,
    'options'
  >> = (props) => (
    <SelectFilter
      {...props}
      {...otherProps}
      options={options}
      canSelectAll
      selectAllLabel="Tout selectionner"
    />
  )

  return Component
}

export default selectFilterFactory
