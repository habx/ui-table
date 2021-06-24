import * as React from 'react'

import { Icon, Tooltip } from '@habx/ui-core'

import { ImportedRow } from '../imex.interface'

import { DataInfo, DataInfoContainer } from './useImportTable.style'

export const IconIndicator: React.FunctionComponent<{
  type: 'addition' | 'edition' | 'ignored'
  label?: string
}> = ({ type, label, children }) => {
  const icon = React.useMemo(() => {
    switch (type) {
      case 'addition':
        return 'add-outline'
      case 'edition':
        return 'check-round-outline'
      case 'ignored':
        return 'x-mark-outline'
    }
  }, [type])

  return (
    <Tooltip title={label ?? ''} small disabled={!label}>
      <DataInfo data-type={type}>
        {children} <Icon icon={icon} />
      </DataInfo>
    </Tooltip>
  )
}

export const DataIndicators: React.VoidFunctionComponent<DataInfoProps> = ({
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
      <IconIndicator
        type="addition"
        label={`${dataInfos.added} ligne(s) ajoutée(s)`}
      >
        {dataInfos.added}
      </IconIndicator>
      <IconIndicator
        type="edition"
        label={`${dataInfos.edited} ligne(s) modifiée(s)`}
      >
        {dataInfos.edited}
      </IconIndicator>
      <IconIndicator
        type="ignored"
        label={`${dataInfos.ignored} ligne(s) ignorée(s)`}
      >
        {dataInfos.ignored}
      </IconIndicator>
    </DataInfoContainer>
  )
}

interface DataInfoProps {
  data: ImportedRow<any>[]
}
