import * as React from 'react'
import styled from 'styled-components'

import { Button, ActionBar, Provider } from '@habx/ui-core'

import { FAKE_DATA, IMEX_COLUMNS } from '../../_fakeData/storyFakeData'
import { Table } from '../../Table'
import { useTable } from '../../useTable'
import { useImportTable } from '../useImportTable'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
`

export default {
  title: 'Import-Export/useImportTable',
}

export const BasicExample = () => {
  const tableInstance = useTable<Faker.Card>({
    data: FAKE_DATA,
    columns: IMEX_COLUMNS,
  })
  const upsertRow = () => new Promise((resolve) => setTimeout(resolve, 1000))
  const { dropzone, overlays } = useImportTable({
    columns: IMEX_COLUMNS,
    upsertRow: upsertRow,
    getOriginalData: () => FAKE_DATA,
    confirmLightBoxTitle: 'Import',
  })

  return (
    <Provider>
      <Container>
        <ActionBar>
          <Button outline onClick={dropzone.getRootProps().onClick}>
            <input {...dropzone.getInputProps()} />
            Import
          </Button>
        </ActionBar>
        {overlays}
        <Table instance={tableInstance} />
      </Container>
    </Provider>
  )
}

export const WithDragAndDrop = () => {
  const tableInstance = useTable<Faker.Card>({
    data: FAKE_DATA,
    columns: IMEX_COLUMNS,
  })
  const upsertRow = () => new Promise((resolve) => setTimeout(resolve, 1000))
  const { dropzone, dropzoneProps, overlays } = useImportTable({
    columns: IMEX_COLUMNS,
    upsertRow: upsertRow,
    getOriginalData: () => FAKE_DATA,
    confirmLightBoxTitle: 'Import',
  })

  return (
    <Provider>
      <Container {...dropzoneProps}>
        <input {...dropzone.getInputProps()} />
        {overlays}
        <Table instance={tableInstance} />
      </Container>
    </Provider>
  )
}
