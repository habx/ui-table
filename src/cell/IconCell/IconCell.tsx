import * as React from 'react'

import { Icon } from '@habx/ui-core'

import IconCellProps from './IconCell.interface'
import {
  IconCellContainer,
  IconContainer,
  LabelContainer,
} from './IconCell.style'

const IconCell = React.forwardRef<HTMLDivElement, IconCellProps>(
  (props, ref) => {
    const { icon, color, label, large = false, ...rest } = props

    return (
      <IconCellContainer {...rest} ref={ref}>
        <IconContainer color={color} data-large={large}>
          <Icon icon={icon} />
        </IconContainer>
        {label && <LabelContainer>{label}</LabelContainer>}
      </IconCellContainer>
    )
  }
)

export default IconCell
