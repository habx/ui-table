import * as React from 'react'
import styled from 'styled-components'

import { FAKE_DATA, BASIC_COLUMNS } from '../../_internal/storyFakeData'
import useTable from '../../useTable'

import BooleanCell from './BooleanCell'

const Container = styled.div`
  height: 100vh;
  width: 800px;
`

export default {
  title: 'Cells/BooleanCell',
}

export const BasicExample = () => {
  const [TableComponent] = useTable<Faker.Card>({
    data: FAKE_DATA,
    columns: [
      {
        Header: 'Boolean',
        id: 'boolean',
        accessor: () => Math.random() > 0.5,
        Cell: ({ cell }) => <BooleanCell value={cell.value} />,
      },
      ...BASIC_COLUMNS,
    ],
  })

  return (
    <Container>
      <TableComponent />
    </Container>
  )
}

export const WithLabel = () => {
  const [TableComponent] = useTable<Faker.Card>({
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
      <TableComponent />
    </Container>
  )
}
