import * as React from 'react'

import { ImageCellContainer } from './ImageCell.style'

export const ImageCell = React.forwardRef<HTMLImageElement, ImageCellProps>(
  (props, ref) => {
    const { value, ...rest } = props

    return (
      <ImageCellContainer>
        <img src={value} alt={value} {...rest} ref={ref} />
      </ImageCellContainer>
    )
  }
)

interface ImageCellProps {
  value: string
}
