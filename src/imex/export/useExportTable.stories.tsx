import * as React from 'react'
import styled from 'styled-components'

import { Button, ActionBar } from '@habx/ui-core'

import { FAKE_DATA, IMEX_COLUMNS } from '../../_fakeData/storyFakeData'
import { Table } from '../../Table'
import { useTable } from '../../useTable'

import { useExportTable } from './useExportTable'

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
  const [downloadTableData] = useExportTable()
  return (
    <Container>
      <ActionBar>
        <Button
          onClick={() =>
            downloadTableData('export', {
              type: 'csv',
              data: FAKE_DATA,
              columns: IMEX_COLUMNS,
            })
          }
        >
          Export CSV
        </Button>
        <Button
          onClick={() =>
            downloadTableData('export', {
              type: 'xls',
              data: FAKE_DATA,
              columns: IMEX_COLUMNS,
            })
          }
        >
          Export XLS
        </Button>
      </ActionBar>
      <Table instance={tableInstance} />
    </Container>
  )
}
