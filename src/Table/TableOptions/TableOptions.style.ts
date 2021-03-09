import styled from 'styled-components'

import { IconButton, Text, theme } from '@habx/ui-core'

export const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  width: 100%;
`

export const PagesPagination = styled(Text).attrs(() => ({ type: 'caption' }))`
  padding-top: 2px;
`

export const PagesChevrons = styled.div`
  display: flex;
  width: 64px;
  justify-content: space-between;
  font-size: 24px;
  margin-left: auto;
`

export const PageSizeContainer = styled.div`
  margin-left: 12px;
  span {
    color: ${theme.neutralColor(400)};
    font-size: 14px;
  }
`

export const DensityIcon = styled(IconButton).attrs(() => ({ tiny: true }))`
  &[data-active='true'] {
    color: ${theme.color('primary')};
    background-color: ${theme.color('primary', { variation: 'calmer' })};
    transition: all ease-in-out 150ms;
  }
`

export const DensityContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 12px;
  padding: 8px 12px;
`
