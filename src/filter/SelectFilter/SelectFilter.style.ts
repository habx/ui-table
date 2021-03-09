import styled from 'styled-components'

import { Select, theme } from '@habx/ui-core'

export const StyledSelect = styled(Select).attrs(() => ({ small: true }))`
  width: 100%;

  &[data-open] {
    &,
    span,
    [data-empty] {
      font-size: 14px;
      font-weight: normal;
      color: ${theme.textColor()} !important;
    }
  }

  border: solid 1px ${theme.neutralColor(300)};
  background-color: ${theme.color('background')};
  box-shadow: none;
`
