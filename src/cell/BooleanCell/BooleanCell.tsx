import * as React from 'react'

import { stringifyColor, useThemeVariant, Text } from '@habx/ui-core'

import { IconCell, IconCellProps } from '../IconCell'

import { BooleanCellContainer } from './BooleanCell.style'

export const BooleanCell = React.forwardRef<HTMLDivElement, BooleanCellProps>(
  (props, ref) => {
    const { value, ...rest } = props

    const theme = useThemeVariant()

    const color = stringifyColor(
      value ? theme.colors.success.base : theme.colors.error.base
    )
    return (
      <BooleanCellContainer>
        <IconCell
          ref={ref}
          icon={value ? 'check-round-outline' : 'x-mark-outline'}
          color={color}
          {...rest}
        />
        <Text color={color} variation="title">
          {value ? 'Oui' : 'Non'}
        </Text>
      </BooleanCellContainer>
    )
  }
)

interface BooleanCellProps extends Omit<IconCellProps, 'icon' | 'color'> {
  value: boolean
}
