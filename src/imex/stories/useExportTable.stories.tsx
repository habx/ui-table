import * as React from 'react'
import styled from 'styled-components'

import { Button, ActionBar } from '@habx/ui-core'

import { FAKE_DATA, IMEX_COLUMNS } from '../../_fakeData/storyFakeData'
import { Table } from '../../Table'
import { useTable } from '../../useTable'
import { useExportTable } from '../useExportTable'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
`

export default {
  title: 'Import-Export/useExportTable',
}

export const BasicExample = () => {
  const tableInstance = useTable<Faker.Card>({
    data: FAKE_DATA,
    columns: IMEX_COLUMNS,
  })
  const [downloadTableData] = useExportTable({
    data: FAKE_DATA,
    columns: IMEX_COLUMNS,
  })
  return (
    <Container>
      <ActionBar>
        <Button onClick={() => downloadTableData('export')}>Export CSV</Button>
        <Button onClick={() => downloadTableData('export', { type: 'xls' })}>
          Export for excel
        </Button>
      </ActionBar>
      <Table instance={tableInstance} />
    </Container>
  )
}
