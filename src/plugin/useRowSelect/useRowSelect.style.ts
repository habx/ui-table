import styled from 'styled-components'

import { zIndex } from '../../_internal/zIndex'

export const CheckboxContainer = styled.div`
  z-index: ${zIndex.checkbox};
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 16px;

  // Prevent onRowClick trigger when clicking on cell
  &:before {
    content: ' ';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }
`
