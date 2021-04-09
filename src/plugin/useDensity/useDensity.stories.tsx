import * as React from 'react'
import { usePagination } from 'react-table'
import styled from 'styled-components'

import { FAKE_DATA, BASIC_COLUMNS } from '../../_fakeData/storyFakeData'
import { Table } from '../../Table'
import { useTable } from '../../useTable'

import { useDensity } from './useDensity'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
`

export default {
  title: 'Plugins/useDensity',
}

export const BasicExample = () => {
  const tableInstance = useTable<Faker.Card>(
    {
      data: FAKE_DATA,
      columns: BASIC_COLUMNS,
    },
    useDensity
  )

  return (
    <Container>
      <Table instance={tableInstance} />
    </Container>
  )
}

export const WithPagination = () => {
  const tableInstance = useTable<Faker.Card>(
    {
      data: FAKE_DATA,
      columns: BASIC_COLUMNS,
    },
    useDensity,
    usePagination
  )

  return (
    <Container>
      <Table instance={tableInstance} />
    </Container>
  )
}
