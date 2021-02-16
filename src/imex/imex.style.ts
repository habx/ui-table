import styled from 'styled-components'

import { Icon, Text, theme, ActionBar as BasActionBar } from '@habx/ui-core'

import { zIndex } from '../_internal/zIndex'

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
  z-index: ${zIndex.overlay};
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
  min-height: 0;

  display: flex;
  flex-direction: column;
`

export const ActionBar = styled(BasActionBar)`
  z-index: ${zIndex.overlay};
`

export const NewCell = styled.div`
  color: ${theme.color('primary')};
  &[data-new-row='true'] {
    display: flex;
    align-items: center;
    > span:first-child {
      margin-right: 8px;
    }
  }
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

export const StyledIMEXDropzone = styled.div`
  height: 100%;
  position: relative;
  outline: none;
`

export const ErrorCellContent = styled.div`
  opacity: 0.5;

  display: flex;
  align-items: center;

  width: 100%;
`

export const ErrorIcon = styled(Icon)`
  margin-right: 8px;
  color: ${theme.color('error')};
`

export const DataInfoContainer = styled.div`
  display: flex;
`

export const DataInfo = styled(Text)`
  display: flex;
  align-items: center;
  margin-right: 16px;

  > :last-child {
    margin-left: 8px;
  }

  &[data-type='ignored'] {
    color: ${theme.color('error')};
  }
  &[data-type='edition'] {
    color: ${theme.color('warning')};
  }
  &[data-type='addition'] {
    color: ${theme.color('primary')};
  }
`
