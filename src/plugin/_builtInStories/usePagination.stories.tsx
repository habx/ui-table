import { withKnobs } from '@storybook/addon-knobs'
import faker from 'faker'
import { range } from 'lodash'
import * as React from 'react'
import {
  usePagination,
} from 'react-table'
import styled from 'styled-components'


import { Table } from '../../Table'
import { useTable } from '../../useTable'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
`


export default {
  title: 'Plugins/builtIn/usePagination',
  decorators: [withKnobs],
}


export const BasicExample = () => {
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
