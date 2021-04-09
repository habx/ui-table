import * as React from 'react'
import { useFilters } from 'react-table'
import styled from 'styled-components'

import {
  FAKE_DATA,
  BASIC_COLUMNS,
  RICH_COLUMNS,
} from '../../_fakeData/storyFakeData'
import { Table } from '../../Table'
import { useTable } from '../../useTable'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
`

export default {
  title: 'Plugins/useFilters [built in]',
}

export const BasicExample = () => {
  const tableInstance = useTable<Faker.Card>(
    {
      data: FAKE_DATA,
      columns: BASIC_COLUMNS,
    },
    useFilters
  )

  return (
    <Container>
      <Table instance={tableInstance} />
    </Container>
  )
}

export const RichFiltersExample = () => {
  const tableInstance = useTable(
    {
      data: FAKE_DATA,
      columns: RICH_COLUMNS,
    },
    useFilters
  )

  return (
    <Container>
      <Table instance={tableInstance} />
    </Container>
  )
}
