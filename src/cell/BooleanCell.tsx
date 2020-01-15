import { has } from 'lodash'
import * as React from 'react'
import * as ReactTable from 'react-table'
import styled from 'styled-components'

import { Icon, theme } from '@habx/ui-core'

const IconContainer = styled.div`
  font-size: 32px;

  &[data-active='true'] {
    color: ${theme.color('primary')};
  }

  &:not([data-active='true']) {
    color: ${theme.color('warning')};
  }
`

const BooleanCell: React.FunctionComponent<BooleanCellProps> = ({
  cell,
  ...props
}) => {
  const value = !!(has(cell.value, 'value') ? !!cell.value.value : cell.value)

  return (
    <IconContainer {...props} data-active={value}>
      <Icon icon={value ? 'eye' : 'eye-outline'} />
    </IconContainer>
  )
}

interface BooleanCellProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ReactTable.CellProps<any> {}

export default BooleanCell
