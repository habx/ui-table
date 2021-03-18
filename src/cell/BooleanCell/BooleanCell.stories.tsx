import * as React from 'react'
import styled from 'styled-components'

import { FAKE_DATA, BASIC_COLUMNS } from '../../_fakeData/storyFakeData'
import { Table } from '../../Table'
import { useTable } from '../../useTable'

import { BooleanCell } from './BooleanCell'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
`

export default {
  title: 'Cells/BooleanCell',
}

export const BasicExample = () => {
  const instance = useTable<Faker.Card>({
    data: FAKE_DATA,
    columns: [
      {
        Header: 'Boolean',
        accessor: 'done',
        Cell: BooleanCell,
      },
      ...BASIC_COLUMNS,
    ],
  })

  return (
    <Container>
      <Table instance={instance} />
    </Container>
  )
}

export const WithLabel = () => {
  const instance = useTable<Faker.Card>({
    data: FAKE_DATA,
    columns: [
      {
        Header: 'Boolean',
        id: 'boolean',
        accessor: () => Math.random() > 0.5,
        Cell: ({ cell }) => (
          <BooleanCell
            value={cell.value}
            label={cell.value ? 'Active' : 'Inactive'}
          />
        ),
      },
      ...BASIC_COLUMNS,
    ],
  })

  return (
    <Container>
      <Table instance={instance} />
    </Container>
  )
}
