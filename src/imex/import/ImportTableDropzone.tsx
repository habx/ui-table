import * as React from 'react'

import { Text, Card } from '@habx/ui-core'

import { UseImportTableParams } from '../imex.interface'

import { useImportTable } from './useImportTable'
import { DropzoneContainer, StyledIMEXDropzone } from './useImportTable.style'

export const ImportTableDropzone: React.FunctionComponent<
  React.PropsWithChildren<UseImportTableParams<any>>
> = ({ children, ...props }) => {
  const importTable = useImportTable(props)

  return (
    <StyledIMEXDropzone {...importTable.dropzoneProps}>
      {children}
      {importTable.dropzone.isDragActive && (
        <DropzoneContainer>
          <Card spacing="narrow">
            <Text>Importer</Text>
          </Card>
        </DropzoneContainer>
      )}
    </StyledIMEXDropzone>
  )
}
