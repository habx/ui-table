import * as React from 'react'

import { useThemeVariant } from '@habx/ui-core'

import IconCell, { IconCellProps } from '../IconCell'

const BooleanCell = React.forwardRef<HTMLDivElement, BooleanCellProps>(
  (props, ref) => {
    const { value, ...rest } = props

    const theme = useThemeVariant()

    return (
      <IconCell
        ref={ref}
        icon={value ? 'check' : 'close'}
        color={value ? theme.colors.success.base : theme.colors.error.base}
        {...rest}
      />
    )
  }
)

interface BooleanCellProps extends Omit<IconCellProps, 'icon' | 'color'> {
  value: boolean
}

export default BooleanCell
