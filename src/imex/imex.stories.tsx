import faker from 'faker'
import { range } from 'lodash'
import * as React from 'react'
import styled from 'styled-components'

import { Button, ActionBar, Provider } from '@habx/ui-core'

import Table from '../Table'
import useTable from '../useTable'

import { IMEXColumn } from './imex.types'
import ImportTableDropzone from './ImportTableDropzone'
import useExportTable from './useExportTable'
import useImportTable from './useImportTable'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
`

const COLUMNS: IMEXColumn<Faker.Card>[] = [
  {
    Header: 'Username',
    accessor: 'username',
    meta: {
      csv: {
        identifier: true,
        type: 'string',
      },
    },
  },
  {
    Header: 'Name',
    accessor: 'name',
    meta: {
      csv: {
        type: 'string',
      },
    },
  },
  {
    Header: 'Email',
    accessor: 'email',
    meta: {
      csv: {
        type: 'string',
      },
    },
  },
  {
    Header: 'City',
    accessor: 'address.city',
    meta: {
      csv: {
        type: 'string',
      },
    },
  },
]

const GROUPS = ['A', 'B', 'C']
const FAKE_DATA = range(50).map(() => ({
  ...faker.helpers.createCard(),
  group: GROUPS[Math.floor(Math.random() * Math.floor(3))],
}))

export default {
  title: 'Import-Export',
}

export const BasicExample = () => {
  const tableInstance = useTable<Faker.Card>({
    data: FAKE_DATA,
    columns: COLUMNS,
  })
  const [downloadTableData] = useExportTable({
    data: FAKE_DATA,
    columns: COLUMNS,
  })
  const upsertRow = () => new Promise((resolve) => setTimeout(resolve, 1000))
  const { dropzone, overlays } = useImportTable({
    columns: COLUMNS,
    upsertRow: upsertRow,
    originalData: FAKE_DATA,
  })

  return (
    <Provider>
      <Container>
        <ActionBar>
          <Button outline onClick={dropzone.getRootProps().onClick}>
            <input {...dropzone.getInputProps()} />
            Import
          </Button>
          <Button onClick={() => downloadTableData('export')}>
            Export CSV
          </Button>
          <Button onClick={() => downloadTableData('export', { type: 'xls' })}>
            Export for excel
          </Button>
        </ActionBar>
        {overlays}
        <ImportTableDropzone
          columns={COLUMNS}
          originalData={FAKE_DATA}
          upsertRow={upsertRow}
        >
          <Table instance={tableInstance} />
        </ImportTableDropzone>
      </Container>
    </Provider>
  )
}
