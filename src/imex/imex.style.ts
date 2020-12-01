import styled from 'styled-components'

import { Text, theme } from '@habx/ui-core'

export const OverlayContainer = styled(Text)`
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100vw;
  left: 0;
  background-color: ${theme.neutralColor(300)};
  opacity: 0.9;
  display: grid;
  justify-items: center;
  align-items: center;
  z-index: 9999999;
  text-align: center;
`

export const OverlayContent = styled.div`
  background: ${theme.color('background')};
  padding: 8px 16px;
  border-radius: 16px;
  box-shadow: ${theme.shadow()};
`

export const DropzoneIndicator = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  background: ${theme.color('primary', { opacity: 0.8 })};
`

export const ConfirmContainer = styled.div`
  height: 100%;

  display: flex;
  flex-direction: column;

  padding: 32px;
`

export const NewCell = styled.div`
  color: ${theme.color('primary')};
`

export const ChangedCell = styled.div`
  display: flex;
  color: ${theme.color('warning')};
  flex-direction: column;
`

export const PrevCell = styled.div`
  text-decoration: line-through;
  color: ${theme.textColor()};
  font-size: 12px;
`

export const StyledCsvDropzone = styled.div`
  height: 100%;
  position: relative;
  outline: none;
`
