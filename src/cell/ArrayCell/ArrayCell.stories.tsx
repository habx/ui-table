import * as React from 'react'
import styled from 'styled-components'

import { FAKE_DATA, BASIC_COLUMNS } from '../../_fakeData/storyFakeData'
import { Table } from '../../Table'
import { useTable } from '../../useTable'

import { ArrayCell } from './ArrayCell'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
`

export default {
  title: 'Cells/ArrayCell',
}

export const BasicExample = () => {
  const instance = useTable<Faker.Card>({
    data: FAKE_DATA,
    columns: [
      {
        Header: 'Array',
        id: 'array',
        accessor: () => ['1', '2', '3'],
        Cell: ({ cell }) => <ArrayCell value={cell.value} />,
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
