import * as React from 'react'
import styled from 'styled-components'

import { palette } from '@habx/ui-core'

import { TableInstance } from '../types/Table'

const LoaderContainer = styled.div`
  margin: 4px 12px;
  width: 100%;
  height: 100%;
  align-items: center;
  display: grid;
  grid-template-columns: var(--table-grid-template-columns);
  grid-gap: var(--table-grid-gap);
`

const Loader = styled.div`
  border-radius: 3px;
  max-width: 400px;
  height: 50%;
  max-height: 16px;
  background: linear-gradient(
    to right,
    ${palette.darkBlue[200]} 20%,
    ${palette.darkBlue[300]} 50%,
    ${palette.darkBlue[200]} 80%
  );
  animation: fading 2s linear infinite;
  background-size: 500px 100px;

  @keyframes fading {
    0% {
      background-position: -250px 0;
    }
    100% {
      background-position: 250px 0;
    }
  }
`

const LoadingRow: React.FunctionComponent<{ instance: TableInstance<any> }> = ({
  instance,
}) => {
  return (
    <LoaderContainer>
      {instance.columns.map((column) => (
        <Loader style={{ width: column.width }} />
      ))}
    </LoaderContainer>
  )
}

export default LoadingRow
