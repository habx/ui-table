import styled from 'styled-components'

import { theme } from '@habx/ui-core'

import { zIndex } from '../../_internal/zIndex'

export const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100vw;
  left: 0;
  background-color: ${theme.color('background', { opacity: 0.5 })};
  display: grid;
  justify-items: center;
  align-items: center;
  z-index: ${zIndex.overlay};
  text-align: center;
`
