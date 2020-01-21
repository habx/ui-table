import * as React from 'react'
import styled from 'styled-components'

import { Tooltip, Icon, palette } from '@habx/ui-core'

import { TableInstance } from '../types/Table'

const DensityIcon = styled(Icon)`
  margin-left: 18px;
  color: ${palette.darkBlue[800]};

  &[data-active='false'] {
    color: ${palette.darkBlue[300]};
    transition: all ease-in-out 150ms;
  }

  &:hover {
    color: ${palette.darkBlue[500]};
    cursor: pointer;
  }
`

const DensityContainer = styled.div`
  display: flex;
  padding-right: 120px;
`

const Density: React.FunctionComponent<DensityProps> = ({ instance }) => {
  return (
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
}

interface DensityProps {
  instance: TableInstance<any>
}

export default Density
