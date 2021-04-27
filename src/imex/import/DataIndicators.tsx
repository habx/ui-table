import * as React from 'react'

import { Icon, Tooltip } from '@habx/ui-core'

import { ImportedRow } from '../imex.interface'

import { DataInfo, DataInfoContainer } from './useImportTable.style'

export const DataIndicators: React.FunctionComponent<DataInfoProps> = ({
  data,
}) => {
  const dataInfos = React.useMemo(() => {
    return {
      added: data?.filter(
        (row) =>
          row._rowMeta.hasDiff &&
          !row._rowMeta.prevVal &&
          !Object.values(row._rowMeta.errors).length
      ).length,
      edited: data?.filter(
        (row) =>
          row._rowMeta.hasDiff &&
          !!row._rowMeta.prevVal &&
          !Object.values(row._rowMeta.errors).length
      ).length,
      ignored: data?.filter((row) => Object.values(row._rowMeta.errors).length)
        .length,
    }
  }, [data])

  return (
    <DataInfoContainer>
      <Tooltip title={`${dataInfos.added} ajout(s)`} small>
        <DataInfo data-type="addition">
          {dataInfos.added} <Icon icon="add-round" />
        </DataInfo>
      </Tooltip>
      <Tooltip title={`${dataInfos.edited} modification(s)`} small>
        <DataInfo data-type="edition">
          {dataInfos.edited} <Icon icon="check-round" />
        </DataInfo>
      </Tooltip>
      <Tooltip title={`${dataInfos.ignored} ignoré(s)`} small>
        <DataInfo data-type="ignored">
          {dataInfos.ignored} <Icon icon="exclam-round" />
        </DataInfo>
      </Tooltip>
    </DataInfoContainer>
  )
}

interface DataInfoProps {
  data: ImportedRow<any>[]
}
