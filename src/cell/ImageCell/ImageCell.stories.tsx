import * as React from 'react'
import styled from 'styled-components'

import { FAKE_DATA, BASIC_COLUMNS } from '../../_fakeData/storyFakeData'
import { Table } from '../../Table'
import { useTable } from '../../useTable'
import { BooleanCell } from '../BooleanCell'

import { ImageCell } from './ImageCell'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
`

export default {
  title: 'Cells/ImageCell',
}

export const BasicExample = () => {
  const instance = useTable<Faker.Card>({
    data: FAKE_DATA,
    columns: [
      {
        Header: 'Image',
        id: 'image',
        accessor: 'image',
        Cell: ImageCell,
      },
      ...BASIC_COLUMNS,
      {
        Header: 'Boolean',
        accessor: 'done',
        Cell: BooleanCell,
      },
      {
        Header: 'Image',
        id: 'image2',
        accessor: 'image',
        Cell: ImageCell,
      },
    ],
  })

  return (
    <Container>
      <Table instance={instance} />
    </Container>
  )
}
