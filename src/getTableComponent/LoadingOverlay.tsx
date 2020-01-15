import * as React from 'react'
import styled from 'styled-components'

import { Loader } from '@habx/ui-core'

export const LoadingContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
  height: 100%;
  padding-top: 200px;
`

const LoadingOverlay: React.FunctionComponent<{}> = () => (
  <LoadingContainer>
    <Loader size="large" outline />
  </LoadingContainer>
)

export default LoadingOverlay
