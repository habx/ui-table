import * as React from 'react'
import styled from 'styled-components'

import { FAKE_DATA, BASIC_COLUMNS } from '../../_fakeData/storyFakeData'
import { Table } from '../../Table'
import { useTable } from '../../useTable'

import { useInfiniteScroll } from './useInfiniteScroll'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
`

export default {
  title: 'Plugins/useInfiniteScroll',
}
export const BasicExample = () => {
  const [data, setData] = React.useState(FAKE_DATA)
  const tableInstance = useTable<Faker.Card>(
    {
      data,
      columns: BASIC_COLUMNS,
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
      <Table instance={tableInstance} virtualized style={{ striped: true }} />
    </Container>
  )
}
