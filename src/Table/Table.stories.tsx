import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import Table from './Table'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
`

storiesOf('Table', module).add('Basic example', () => (
  <Container>
    <Table />
  </Container>
))
