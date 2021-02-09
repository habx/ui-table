import * as React from 'react'

import { UseImportTableParams } from './imex.interface'
import { StyledIMEXDropzone } from './imex.style'
import useImportTable from './useImportTable'

const ImportTableDropzone: React.FunctionComponent<
  UseImportTableParams<any>
> = ({ children, ...props }) => {
  const { overlays, dropzoneProps } = useImportTable(props)

  return (
    <StyledIMEXDropzone {...dropzoneProps}>
      {children}
      {overlays}
    </StyledIMEXDropzone>
  )
}

export default ImportTableDropzone
