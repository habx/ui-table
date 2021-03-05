import * as React from 'react'
import styled from 'styled-components'

export const HeaderCellContainer = styled.div`
  display: flex;
  align-items: center;

  span {
    margin-right: 12px;
  }
`

export const HeaderCell: React.FunctionComponent<any> = ({ icon, content }) => (
  <HeaderCellContainer>
    {icon}
    {content}
  </HeaderCellContainer>
)
