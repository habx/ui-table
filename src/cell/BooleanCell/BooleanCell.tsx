import * as React from 'react'

import { stringifyColor, useThemeVariant } from '@habx/ui-core'

import { IconCell, IconCellProps } from '../IconCell'

import { BooleanCellContainer } from './BooleanCell.style'

export const BooleanCell = React.forwardRef<HTMLDivElement, BooleanCellProps>(
  (props, ref) => {
    const { value, ...rest } = props

    const theme = useThemeVariant()

    const iconProps = React.useMemo<
      Pick<IconCellProps, 'color' | 'icon' | 'label'>
    >(() => {
      switch (value) {
        case true:
          return {
            icon: 'check-round-outline',
            color: stringifyColor(theme.colors.success.base),
            label: 'Oui',
          }
        case false:
          return {
            icon: 'x-mark-outline',
            color: stringifyColor(theme.colors.error.base),
            label: 'Non',
          }
        default:
          return {
            icon: 'question-round-outline',
            color: stringifyColor(theme.colors.secondary.calm),
            label: 'Non défini',
          }
      }
    }, [
      theme.colors.error.base,
      theme.colors.secondary.calm,
      theme.colors.success.base,
      value,
    ])

    return (
      <BooleanCellContainer>
        <IconCell ref={ref} {...iconProps} {...rest} />
      </BooleanCellContainer>
    )
  }
)

interface BooleanCellProps extends Omit<IconCellProps, 'icon' | 'color'> {
  value?: boolean | null
}
