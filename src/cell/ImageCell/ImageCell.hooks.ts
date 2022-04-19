import * as React from 'react'

import { IMAGE_ZOOM_SIZE } from './ImageCell.style'

export const useZoomStyle = (imageRef: React.RefObject<HTMLImageElement>) => {
  const [zoomStyle, setZoomStyle] =
    React.useState<React.CSSProperties | undefined>(undefined)

  React.useLayoutEffect(() => {
    if (imageRef.current) {
      const handleHoverImage = () => {
        const currentPosition = imageRef.current?.getBoundingClientRect()
        if (currentPosition) {
          const horizontalStyle =
            (currentPosition?.right ?? 0) + IMAGE_ZOOM_SIZE >= window.innerWidth
              ? {
                  left: `${
                    currentPosition?.left -
                    IMAGE_ZOOM_SIZE -
                    currentPosition?.width
                  }px`,
                }
              : { left: `${currentPosition?.right}px` }
          const verticalStyle =
            (currentPosition?.bottom ?? 0) + IMAGE_ZOOM_SIZE >=
            window.innerHeight
              ? {
                  top: `${currentPosition?.bottom - IMAGE_ZOOM_SIZE}px`,
                }
              : { top: `${currentPosition?.top}px` }
          setZoomStyle({
            ...horizontalStyle,
            ...verticalStyle,
          })
        }
      }
      const handleBlurImage = () => {
        setZoomStyle(undefined)
      }
      imageRef.current.addEventListener('mouseenter', handleHoverImage)
      imageRef.current.addEventListener('mouseleave', handleBlurImage)
      return () => {
        imageRef.current?.removeEventListener('mouseenter', handleHoverImage)
        imageRef.current?.removeEventListener('mouseleave', handleBlurImage)
      }
    }
  }, [imageRef])

  return zoomStyle
}
