import * as React from 'react'
import styled from 'styled-components'

import { palette } from '@habx/ui-core'

import { FAKE_DATA, BASIC_COLUMNS } from '../../_fakeData/storyFakeData'
import Table from '../../Table'
import useTable from '../../useTable'

import IconCell from './IconCell'

const Container = styled.div`
  height: 100vh;
  width: 800px;
`

export default {
  title: 'Cells/IconCell',
}

export const BasicExample = () => {
  const instance = useTable<Faker.Card>({
    data: FAKE_DATA,
    columns: [
      {
        Header: 'Icon',
        id: 'icon',
        accessor: () => Math.random() > 0.5,
        Cell: ({ cell }) => (
          <IconCell icon={cell.value ? 'paper-plane-filled' : 'eye'} />
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

export const WithLabel = () => {
  const instance = useTable<Faker.Card>({
    data: FAKE_DATA,
    columns: [
      {
        Header: 'Icon',
        id: 'icon',
        accessor: () => Math.random() > 0.5,
        Cell: ({ cell }) => (
          <IconCell
            icon={cell.value ? 'paper-plane-filled' : 'eye'}
            label={cell.value ? 'Sent' : 'Seen'}
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

export const WithCustomColor = () => {
  const instance = useTable<Faker.Card>({
    data: FAKE_DATA,
    columns: [
      {
        Header: 'Icon',
        id: 'icon',
        accessor: () => Math.random() > 0.5,
        Cell: ({ cell }) => (
          <IconCell
            icon={cell.value ? 'paper-plane-filled' : 'eye'}
            color={cell.value ? palette.yellow[600] : palette.blue[600]}
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
