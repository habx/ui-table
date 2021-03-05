import { withKnobs } from '@storybook/addon-knobs'
import * as React from 'react'
import styled from 'styled-components'

import { BASIC_COLUMNS, FAKE_DATA } from '../_fakeData/storyFakeData'
import { Table } from '../Table'
import { useTable } from '../useTable'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
`

export default {
  title: 'Table/styles',
  decorators: [withKnobs],
}

export const Stripped = () => {
  const tableInstance = useTable<Faker.Card>({
    data: FAKE_DATA,
    columns: BASIC_COLUMNS,
  })
  return (
    <Container>
      <Table instance={tableInstance} style={{ striped: true }} />
    </Container>
  )
}
