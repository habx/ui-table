import * as React from 'react'

import { StyledCsvDropzone } from './imex.style'
import useImportTable, { UseImportTableParams } from './useImportTable'

const ImportTableDropzone: React.FunctionComponent<UseImportTableParams<
  any
>> = ({ children, ...props }) => {
  const { overlays, dropzoneProps } = useImportTable(props)

  return (
    <StyledCsvDropzone {...dropzoneProps}>
      {children}
      {overlays}
    </StyledCsvDropzone>
  )
}

export default ImportTableDropzone
