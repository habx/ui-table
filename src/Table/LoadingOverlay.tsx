import * as React from 'react'
import styled from 'styled-components'

import { Loader, theme } from '@habx/ui-core'

export const LoadingContainer = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${theme.color('background')};
  opacity: 0.8;
`

export const LoadingOverlay: React.FunctionComponent = () => (
  <LoadingContainer>
    <Loader size="large" outline />
  </LoadingContainer>
)
