import { withKnobs } from '@storybook/addon-knobs'
import * as React from 'react'
import { useFilters, usePagination, useSortBy, useRowSelect } from 'react-table'
import styled from 'styled-components'

import { Text } from '@habx/ui-core'

import { BASIC_COLUMNS, FAKE_DATA } from '../_fakeData/storyFakeData'
import { useDensity } from '../plugin/useDensity'
import { Table } from '../Table'
import { useTable } from '../useTable'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
`

export default {
  title: 'Table/useTable',
  decorators: [withKnobs],
}

export const BasicExample = () => {
  const tableInstance = useTable<Faker.Card>({
    data: FAKE_DATA,
    columns: BASIC_COLUMNS,
  })
  return (
    <Container>
      <Table instance={tableInstance} />
    </Container>
  )
}

export const Virtualized = () => {
  const tableInstance = useTable<Faker.Card>({
    data: new Array(10).fill(0).flatMap(() => FAKE_DATA),
    columns: BASIC_COLUMNS,
  })

  return (
    <Container>
      <Table instance={tableInstance} virtualized />
    </Container>
  )
}

export const HorizontalScroll = () => {
  const tableInstance = useTable<Faker.Card>({
    data: FAKE_DATA,
    columns: [
      ...BASIC_COLUMNS,
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

export const FullExample = () => {
  const tableInstance = useTable<Faker.Card>(
    {
      data: FAKE_DATA,
      columns: BASIC_COLUMNS,
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
    columns: BASIC_COLUMNS,
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
