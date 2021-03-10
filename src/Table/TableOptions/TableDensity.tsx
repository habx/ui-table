import * as React from 'react'

import { Tooltip } from '@habx/ui-core'

import { TableInstance } from '../../types/Table'

import { DensityContainer, DensityIcon } from './TableOptions.style'

export const TableDensity: React.FunctionComponent<DensityProps> = ({
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
