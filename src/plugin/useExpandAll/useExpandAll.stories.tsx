import * as React from 'react'
import { useGroupBy, useExpanded } from 'react-table'
import styled from 'styled-components'

import { FAKE_DATA, BASIC_COLUMNS } from '../../_fakeData/storyFakeData'
import { Table } from '../../Table'
import { useTable } from '../../useTable'

import { useExpandAll } from './useExpandAll'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
`

export default {
  title: 'Plugins/useExpandAll',
}

const columns = [
  {
    Header: 'Group',
    accessor: 'group',
    Cell: ({ row: { groupByVal } }) => {
      return groupByVal
    },
  },
  ...BASIC_COLUMNS,
]

export const BasicExample = () => {
  const tableInstance = useTable<Faker.Card>(
    {
      data: FAKE_DATA,
      columns,
      initialState: {
        groupBy: ['group'],
      },
    },
    useGroupBy,
    useExpanded,
    useExpandAll
  )

  return (
    <Container>
      <Table instance={tableInstance} />
    </Container>
  )
}
