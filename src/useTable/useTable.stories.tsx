import { storiesOf } from '@storybook/react'
import faker from 'faker'
import { range } from 'lodash'
import * as React from 'react'
import { useFilters, useGroupBy, usePagination, useSortBy } from 'react-table'
import styled from 'styled-components'

import { Text } from '@habx/ui-core'

import BooleanCell from '../cell/BooleanCell'
import useDensity from '../plugin/useDensity'
import useExpanded from '../plugin/useExpanded'
import { Column } from '../types/Table'
import useTable from '../useTable'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
`

const COLUMNS: Column<Faker.Card>[] = [
  {
    Header: 'Username',
    accessor: el => el.username,
  },
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Email',
    accessor: 'email',
  },
  {
    Header: 'Email has digit',
    accessor: el => el.email.match(/[0-9]/),
    Cell: BooleanCell,
    Aggregated: () => '',
  },
  {
    Header: 'City',
    accessor: 'address.city',
  },
]

const GROUPS = ['A', 'B', 'C']
const FAKE_DATA = range(50).map(() => ({
  ...faker.helpers.createCard(),
  group: GROUPS[Math.floor(Math.random() * Math.floor(3))],
}))

storiesOf('Table', module)
  .add('Basic example', () => {
    const [TableComponent] = useTable<Faker.Card>({
      data: FAKE_DATA,
      columns: COLUMNS,
    })

    return (
      <Container>
        <TableComponent />
      </Container>
    )
  })
  .add('Pagination', () => {
    const [TableComponent] = useTable<Faker.Card>(
      {
        data: FAKE_DATA,
        columns: COLUMNS,
      },
      usePagination
    )

    return (
      <Container>
        <TableComponent />
      </Container>
    )
  })
  .add('Pagination + Density', () => {
    const [TableComponent] = useTable<Faker.Card>(
      {
        data: FAKE_DATA,
        columns: COLUMNS,
      },
      usePagination,
      useDensity
    )

    return (
      <Container>
        <TableComponent />
      </Container>
    )
  })
  .add('Sort by', () => {
    const [TableComponent] = useTable<Faker.Card>(
      {
        data: FAKE_DATA,
        columns: COLUMNS,
      },
      useSortBy
    )

    return (
      <Container>
        <TableComponent />
      </Container>
    )
  })
  .add('Filters', () => {
    const [TableComponent] = useTable<Faker.Card>(
      {
        data: FAKE_DATA,
        columns: COLUMNS,
      },
      useFilters
    )

    return (
      <Container>
        <TableComponent />
      </Container>
    )
  })
  .add('Horizontal scroll', () => {
    const [TableComponent] = useTable<Faker.Card>({
      data: FAKE_DATA,
      columns: [
        ...COLUMNS,
        ...new Array(40).fill(0).map(() => ({
          Header: `column`,
          accessor: () => 'cell',
          id: `${Math.random()}`,
        })),
      ],
    })

    return (
      <Container>
        <TableComponent style={{ striped: true }} />
      </Container>
    )
  })
  .add('Sections', () => {
    const [TableComponent] = useTable<Faker.Card>(
      {
        data: FAKE_DATA,
        columns: [
          {
            Header: 'Group',
            accessor: 'group',
            Cell: ({ row: { groupByVal } }) => {
              return groupByVal
            },
          },
          ...COLUMNS,
        ],
        expandAll: true,
        initialState: {
          groupBy: ['group'],
        },
      },
      useGroupBy,
      useExpanded
    )

    return (
      <Container>
        <TableComponent />
      </Container>
    )
  })
  .add('Full example', () => {
    const [TableComponent] = useTable<Faker.Card>(
      {
        data: FAKE_DATA,
        columns: COLUMNS,
      },
      useFilters,
      useSortBy,
      usePagination,
      useDensity
    )

    return (
      <Container>
        <TableComponent />
      </Container>
    )
  })
  .add('No Data', () => {
    const [TableComponent] = useTable<Faker.Card>({
      data: [],
      columns: COLUMNS,
    })

    return (
      <Container>
        <TableComponent noDataComponent={() => <Text>No data</Text>} />
      </Container>
    )
  })
