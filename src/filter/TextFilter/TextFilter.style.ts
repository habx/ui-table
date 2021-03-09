import styled from 'styled-components'

import { TextInput, theme } from '@habx/ui-core'

export const TextFilterInput = styled(TextInput)`
  border: solid 1px ${theme.neutralColor(300)};
  background-color: ${theme.color('background')};

  span {
    font-size: 16px;
  }
  input {
    font-size: 14px !important;
  }
`
