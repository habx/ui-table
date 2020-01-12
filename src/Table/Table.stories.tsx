import { storiesOf } from '@storybook/react'
import faker from 'faker'
import { range } from 'lodash'
import * as React from 'react'
import styled from 'styled-components'

import Table from './Table'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
`

const columns = [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Email',
    accessor: 'email',
  },
]

const fakeData = range(50).map(i => {
  const card = faker.helpers.createCard()

  return {
    id: i,
    name: card.name,
    email: card.email,
  }
})

storiesOf('Table', module).add('Basic example', () => (
  <Container>
    <Table data={fakeData} columns={columns} />
  </Container>
))
