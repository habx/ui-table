import { action } from '@storybook/addon-actions'
import { withKnobs, number, select } from '@storybook/addon-knobs'
import faker from 'faker'
import { range } from 'lodash'
import * as React from 'react'
import {
  useFilters,
  useGroupBy,
  usePagination,
  useSortBy,
  useRowSelect,
  useExpanded,
} from 'react-table'
import styled from 'styled-components'

import { Text } from '@habx/ui-core'

import { BooleanCell } from '../cell/BooleanCell/BooleanCell'
import { useDensity } from '../plugin/useDensity'
import { useExpandAll } from '../plugin/useExpandAll'
import { useInfiniteScroll } from '../plugin/useInfiniteScroll/useInfiniteScroll'
import { Table } from '../Table'
import { Column } from '../types/Table'
import { useTable } from '../useTable'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
`

const COLUMNS: Column<Faker.Card>[] = [
  {
    Header: 'Username',
    accessor: (el) => el.username,
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
    accessor: (el) => el.email.match(/[0-9]/),
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

export default {
  title: 'Table',
  decorators: [withKnobs],
}

export const BasicExample = () => {
  const tableInstance = useTable<Faker.Card>({
    data: FAKE_DATA,
    columns: COLUMNS,
  })
  return (
    <Container>
      <Table instance={tableInstance} />
    </Container>
  )
}

export const Pagination = () => {
  const tableInstance = useTable<Faker.Card>(
    {
      data: FAKE_DATA,
      columns: COLUMNS,
      pageSizeOptions: [5, 10, 15, 20],
    },
    usePagination
  )

  return (
    <Container>
      <Table instance={tableInstance} />
    </Container>
  )
}

export const Virtualized = () => {
  const tableInstance = useTable<Faker.Card>({
    data: new Array(10).fill(0).flatMap(() => FAKE_DATA),
    columns: COLUMNS,
  })

  return (
    <Container>
      <Table instance={tableInstance} virtualized />
    </Container>
  )
}

export const InfiniteScroll = () => {
  const [data, setData] = React.useState(FAKE_DATA)
  const tableInstance = useTable<Faker.Card>(
    {
      data,
      columns: COLUMNS,
      loadMore: () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            setData((currentData) => [...currentData, ...FAKE_DATA])
            resolve()
          }, 5000)
        })
      },
      total: 1000,
    },
    useInfiniteScroll
  )

  return (
    <Container>
      <Table instance={tableInstance} virtualized />
    </Container>
  )
}

export const ControlledPagination = () => {
  const tableInstance = useTable<Faker.Card>(
    {
      data: FAKE_DATA,
      columns: COLUMNS,
      manualPagination: true,
      onPaginationChange: action('Pagination changed'),
      pageCount: number('Page Count', 10),
      pagination: {
        pageSize: select('Page Size', [10, 20, 30, 40, 50], 10),
        pageIndex: number('Page Index', 0),
      },
    },
    usePagination
  )

  return (
    <Container>
      <Table instance={tableInstance} />
    </Container>
  )
}

export const PaginationAndDensity = () => {
  const tableInstance = useTable<Faker.Card>(
    {
      data: FAKE_DATA,
      columns: COLUMNS,
    },
    usePagination,
    useDensity
  )

  return (
    <Container>
      <Table instance={tableInstance} />
    </Container>
  )
}

export const SortBy = () => {
  const tableInstance = useTable<Faker.Card>(
    {
      data: FAKE_DATA,
      columns: COLUMNS,
    },
    useSortBy
  )

  return (
    <Container>
      <Table instance={tableInstance} />
    </Container>
  )
}

export const Filters = () => {
  const tableInstance = useTable<Faker.Card>(
    {
      data: FAKE_DATA,
      columns: COLUMNS,
    },
    useFilters
  )

  return (
    <Container>
      <Table instance={tableInstance} />
    </Container>
  )
}

export const HorizontalScroll = () => {
  const tableInstance = useTable<Faker.Card>({
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
      <Table instance={tableInstance} style={{ striped: true }} />
    </Container>
  )
}

export const Sections = () => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Group',
        accessor: 'group',
        Cell: ({ row: { groupByVal } }) => {
          return groupByVal
        },
      },
      ...COLUMNS,
    ],
    []
  )
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

export const SelectRow = () => {
  const tableInstance = useTable<Faker.Card>(
    {
      data: FAKE_DATA,
      columns: COLUMNS,
      getCheckboxProps: (row) => {
        if (row.id === '2') {
          return { disabled: true }
        }
        return {}
      },
    },
    useRowSelect
  )

  return (
    <Container>
      <Table instance={tableInstance} />
    </Container>
  )
}

export const FullExample = () => {
  const tableInstance = useTable<Faker.Card>(
    {
      data: FAKE_DATA,
      columns: COLUMNS,
    },
    useFilters,
    useSortBy,
    usePagination,
    useDensity,
    useRowSelect
  )

  return (
    <Container>
      <Table instance={tableInstance} />
    </Container>
  )
}

export const NoData = () => {
  const tableInstance = useTable<Faker.Card>({
    data: [],
    columns: COLUMNS,
  })

  return (
    <Container>
      <Table
        instance={tableInstance}
        noDataComponent={() => <Text>No data</Text>}
      />
    </Container>
  )
}
