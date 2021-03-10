import * as React from 'react'

import { useMergedRef } from '../../_internal/useMergedRef'

import { useZoomStyle } from './ImageCell.hooks'
import { ImageCellContainer, Image, ImageZoom } from './ImageCell.style'

export const ImageCell = React.forwardRef<HTMLImageElement, ImageCellProps>(
  (props, ref) => {
    const { value, ...rest } = props

    const imageRef = useMergedRef(ref)
    const zoomStyle = useZoomStyle(imageRef)

    return (
      <ImageCellContainer>
        <Image ref={imageRef} src={value} alt={value} {...rest} />
        {zoomStyle && <ImageZoom src={value} alt={value} style={zoomStyle} />}
      </ImageCellContainer>
    )
  }
)

interface ImageCellProps {
  value: string
}
