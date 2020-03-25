import * as React from 'react'

import { palette } from '@habx/ui-core'

import IconCell, { IconCellProps } from '../IconCell'

const BooleanCell: React.FunctionComponent<BooleanCellProps> = ({
  value,
  ...props
}) => (
  <IconCell
    icon={value ? 'check' : 'close'}
    color={value ? palette.green[600] : palette.orange[400]}
    {...props}
  />
)

interface BooleanCellProps extends Omit<IconCellProps, 'icon' | 'color'> {
  value: boolean
}

export default BooleanCell
