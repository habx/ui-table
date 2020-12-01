import * as React from 'react'
import styled from 'styled-components'

import { theme } from '@habx/ui-core'

export const LoadingBarStyled = styled.div`
  width: 300px;
  height: 8px;
  --loading-bar-progress: 0%;
  position: relative;

  background: ${theme.neutralColor(300)};

  &:after {
    transition: width ease-in-out 150ms;

    content: '';
    position: absolute;
    left: 0;
    height: 100%;
    width: var(--loading-bar-progress);
    background: ${theme.color('primary')};
  }
`

const LoadingBar: React.FunctionComponent<LoadingBarInterface> = ({
  loaded,
  total,
}) => (
  <LoadingBarStyled
    style={
      {
        '--loading-bar-progress': `${(loaded / total) * 100}%`,
      } as React.CSSProperties
    }
  />
)

interface LoadingBarInterface {
  loaded: number
  total: number
}

export default LoadingBar
