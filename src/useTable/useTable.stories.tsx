import { storiesOf } from '@storybook/react'
import faker from 'faker'
import { range } from 'lodash'
import * as React from 'react'
import { useFilters, usePagination, useSortBy } from 'react-table'
import styled from 'styled-components'

import BooleanCell from '../cell/BooleanCell'
import useDensity from '../plugin/useDensity/useDensity'
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
  },
  {
    Header: 'City',
    accessor: 'address.city',
  },
]

const FAKE_DATA = range(50).map(() => faker.helpers.createCard())

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
