import * as React from 'react'
import styled from 'styled-components'

import { Tooltip, Icon, theme } from '@habx/ui-core'

import { TableInstance } from '../types/Table'

const DensityIcon = styled(Icon)`
  margin-left: 18px;
  color: ${theme.neutralColor(800)};

  &[data-active='false'] {
    color: ${theme.neutralColor(300)};
    transition: all ease-in-out 150ms;
  }

  &:hover {
    color: ${theme.neutralColor(500)};
    cursor: pointer;
  }
`

const DensityContainer = styled.div`
  display: flex;
  padding: 8px 12px;
`

export const Density: React.FunctionComponent<DensityProps> = ({
  instance,
}) => (
  <DensityContainer>
    <Tooltip small title="Low">
      <DensityIcon
        icon="density-low"
        data-active={instance.state.density === 'low'}
        onClick={() => instance.setDensity('low')}
      />
    </Tooltip>
    <Tooltip small title="Medium">
      <DensityIcon
        icon="density-medium"
        data-active={instance.state.density === 'medium'}
        onClick={() => instance.setDensity('medium')}
      />
    </Tooltip>
    <Tooltip small title="High">
      <DensityIcon
        icon="density-high"
        data-active={instance.state.density === 'high'}
        onClick={() => instance.setDensity('high')}
      />
    </Tooltip>
  </DensityContainer>
)

interface DensityProps {
  instance: TableInstance<any>
}
